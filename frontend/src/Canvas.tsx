import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createControls } from "./scripts/ViewportControls.js";
import { createScene } from "./scripts/Scene.js";
import ColorPalette from "./components/ColorPalette";
import Toolbar from "./components/Toolbar";
import { useStateController } from "./helpers/StateProvider.js";
import ModeSlider from "./components/ModeSlider";
import { handleUI } from "./scripts/UIHandler.js";
import useWebSocket from "react-use-websocket";
import {
  CLICKS_INTERVAL,
  CLICKS_LIMIT,
  COOLDOWN_LENGTH,
  SPAM_MESSAGE,
  VOXEL_SIZE,
} from "./helpers/Constants.ts";
import { gridToWorldCoordinates } from "./helpers/ChangeCoords.ts";
import { QuickGuide } from "./components/QuickGuide.tsx";
import { FeedbackForm } from "./components/FeedbackForm.tsx";
import { useSnackbar } from "notistack";
import { CSSTransition } from "react-transition-group";
import InfoModal from "./components/InfoModal.tsx";
import { createPortal } from "react-dom";
import PaletteModal from "./components/PaletteModal.tsx";

function Canvas(props: { username: string }) {
  // access state variables through global provider
  const {
    currColorRef,
    setControls,
    isMouseOverUIRef,
    setIsMouseOverUI,
    isBuildModeRef,
    setIsBuildModeRef,
    isServerOnlineRef,
    setIsServerOnline,
  } = useStateController();

  //! backend endpoint
  const WEB_SOCKET_URL =
    import.meta.env.VITE_WEB_SOCKET_URL || "ws://127.0.0.1:8000";

  // access canvas element from DOM with useRef -> won't trigger rerender when canvasRef changes
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<any>(null);

  // spam detection variables - clicks per second (CPS)
  const clickCountRef = useRef(0); // track click count
  const [, setClicksPerInterval] = useState(0); // value to raise spam detector
  const [isSpamming, setIsSpamming] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let snackbarId: any;

  const handleSpam = () => {
    clickCountRef.current++; // spam prevention
    setClicksPerInterval(clickCountRef.current); // spam prevention
    if (clickCountRef.current > CLICKS_LIMIT) {
      setIsSpamming(true);
      setIsBuildModeRef(false);
      controlsRef.current.enableRotate = true;
      snackbarId = enqueueSnackbar(SPAM_MESSAGE, {
        variant: "error",
        preventDuplicate: true,
        persist: true,
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
        className: "snackbar",
      });

      // set up a timer to close the snackbar after 20 seconds
      setTimeout(() => {
        closeSnackbar(snackbarId);
        setIsSpamming(false);
      }, COOLDOWN_LENGTH);
    }
  };

  // mobile info modal
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const mobileMediaQuery = window.matchMedia("(max-width: 1024px)");
  const handleMediaQueryChange = (e: MediaQueryListEvent) => {
    setShowInfoModal(e.matches); // show modal if the screen mobile
  };

  // mobile color palette modal
  const [showPaletteModal, setShowPaletteModal] = useState<boolean>(false);

  // keep updated list of all rendered objects
  const sceneObjectsRef = useRef<any[]>([]);

  // establish web socket connection
  const { sendJsonMessage, lastMessage } = useWebSocket(WEB_SOCKET_URL, {
    queryParams: { username: props.username },
  });

  // process incoming messages from ws connection
  useEffect(() => {
    if (lastMessage !== null) {
      setIsServerOnline(true);
      const data = JSON.parse(lastMessage.data);

      if (data.type === "INITIAL_DATA") {
        data.voxels.forEach((voxel: any) => {
          addVoxelToScene(voxel);
        });
      } else if (data.type === "NEW_VOXEL") {
        addVoxelToScene(data.voxel);
      } else if (data.type === "DELETE_VOXEL") {
        removeVoxelFromScene(data.voxel);
      }
    }
  }, [lastMessage]);

  // function to add a voxel to the scene given voxel obj
  const addVoxelToScene = (voxel: {
    x: any;
    y: any;
    z: any;
    color: any;
    creatorName: string;
    timeCreated: Date;
  }) => {
    if (voxel != null) {
      const { x, y, z, color } = voxel;
      // database stores coords in grid --> need to convert to world three.js coords
      const { worldX, worldY, worldZ } = gridToWorldCoordinates(x, y, z);

      const voxelGeometry = new THREE.BoxGeometry(
        VOXEL_SIZE,
        VOXEL_SIZE,
        VOXEL_SIZE
      );

      // parse color from hex to decimal
      const colorDecimal = parseInt(color.replace("#", ""), 16);

      // create a matcap material
      const voxelBaseMat = new THREE.MeshMatcapMaterial({
        color: colorDecimal,
      });

      const voxelMesh = new THREE.Mesh(voxelGeometry, voxelBaseMat);
      voxelMesh.name = "voxel";

      voxelMesh.position.set(worldX, worldY, worldZ);
      sceneRef.current?.add(voxelMesh);

      sceneObjectsRef.current?.push(voxelMesh);
    }
  };

  // helper function to send voxel data to server
  const placeVoxel = (x: number, y: number, z: number, color: string) => {
    handleSpam();
    if (!isSpamming)
      sendJsonMessage({
        type: "NEW_VOXEL",
        x,
        y,
        z,
        color,
        creatorName: props.username,
        timeCreated: Date.now(),
      });
  };

  // function to remove voxel from scene
  function removeVoxelFromScene(voxel: { x: any; y: any; z: any }) {
    // database stores coords in grid --> need to convert to world coords
    const { worldX, worldY, worldZ } = gridToWorldCoordinates(
      voxel.x,
      voxel.y,
      voxel.z
    );

    // find the voxel object in the sceneObjectsRef array based on its position
    const voxelToRemove = sceneObjectsRef.current.find(
      (obj) =>
        obj.position.x === worldX &&
        obj.position.y === worldY &&
        obj.position.z === worldZ
    );

    if (voxelToRemove) {
      // remove the voxel mesh from the scene
      sceneRef.current?.remove(voxelToRemove);

      // also remove the voxel mesh from the sceneObjectsRef array
      sceneObjectsRef.current = sceneObjectsRef.current.filter(
        (obj) => obj !== voxelToRemove
      );
    }
  }

  // helper function to remove voxel data from server
  const deleteVoxel = (x: number, y: number, z: number) => {
    handleSpam();
    if (!isSpamming)
      sendJsonMessage({
        type: "DELETE_VOXEL",
        x,
        y,
        z,
        color: "transparent",
        creatorName: props.username,
        timeCreated: Date.now(),
      });
  };

  useEffect(() => {
    // scene, camera, renderer initalization
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      8000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      // alpha: true,
    });

    // scene config
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, innerHeight);

    const gradientTexture = createGradientTexture(1024, 1024);
    scene.background = gradientTexture;

    const controls = createControls(camera, renderer);
    controlsRef.current = controls;
    setControls(controls);
    controls.saveState();
    // start with build mode
    controls.enableRotate = false;

    // initialize scene and extract remove window listeners
    const removeEventListeners = createScene(
      sceneRef.current,
      camera,
      renderer,
      currColorRef,
      isMouseOverUIRef,
      isBuildModeRef,
      placeVoxel,
      sceneObjectsRef,
      isServerOnlineRef,
      deleteVoxel
    );

    // init media query listener
    setShowInfoModal(mobileMediaQuery.matches); // auto show modal if screen mobile
    mobileMediaQuery.addEventListener("change", handleMediaQueryChange);
    //! handle weird mobile website formatting
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }

    // resert clicks per interval tracker
    setInterval(() => {
      clickCountRef.current = 0;
      setClicksPerInterval(clickCountRef.current);
    }, CLICKS_INTERVAL);

    const animate = () => {
      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);

      if (controls.enabled) controls.update();
    };
    animate();

    return () => {
      // clean up event listeners to prevent duplicate events to trigger
      removeEventListeners();
      mobileMediaQuery.removeEventListener("change", handleMediaQueryChange);
      controls.dispose();
    };
  }, []);

  // call handleUI after the components are mounted
  // lowk this is implemented hella bad but
  // useRef might be better since it might be readding listeners
  useEffect(() => {
    handleUI(setIsMouseOverUI);
  }, [setIsMouseOverUI]); // re-run when setter changes

  function createGradientTexture(width: any, height: any) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Texture(canvas);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#4182A4");
    gradient.addColorStop(0.3, "#a1b8bc");
    gradient.addColorStop(1, "#F2F2F2");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  return (
    <>
      <QuickGuide />
      <ModeSlider isSpamming={isSpamming} />
      <Toolbar
        setShowInfoModal={setShowInfoModal}
        setShowPaletteModal={setShowPaletteModal}
      />

      <CSSTransition
        in={!isSpamming}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <ColorPalette controls={controlsRef} />
      </CSSTransition>

      <FeedbackForm />

      {showInfoModal &&
        createPortal(
          <InfoModal
            handleClose={() => {
              setShowInfoModal(false);
              setIsMouseOverUI(false); // toggle off mouseOverUI
            }}
            setIsMouseOverUI={setIsMouseOverUI}
          />,
          document.body
        )}

      {showPaletteModal &&
        createPortal(
          <PaletteModal
            handleClose={() => {
              setShowPaletteModal(false);
              setIsMouseOverUI(false); // toggle off mouseOverUI
            }}
            controls={controlsRef}
            setIsMouseOverUI={setIsMouseOverUI}
          />,
          document.body
        )}
      {/* <p className="absolute text-black bottom-0 left-0">
        Clicks per second: {clicksPerInterval}
      </p> */}
      <canvas ref={canvasRef} id="3canvas" />
    </>
  );
}

export default Canvas;

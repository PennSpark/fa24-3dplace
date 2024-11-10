import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createControls } from "./scripts/ViewportControls.js";
import { createScene } from "./scripts/Scene.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import {
  gridCellSize,
  viewportGizmoOptions,
  WEB_SOCKET_URL,
} from "./helpers/Constants.js";
import ColorPalette from "./components/ColorPalette";
import Toolbar from "./components/Toolbar";
import { useStateController } from "./helpers/StateProvider.js";
import ModeSlider from "./components/ModeSlider";
import { handleUI } from "./scripts/UIHandler.js";
import useWebSocket from "react-use-websocket";

function Canvas(props: { username: string }) {
  // access state variables through global provider
  const {
    currColorRef,
    setControls,
    isMouseOverUIRef,
    setIsMouseOverUI,
    isBuildModeRef,
  } = useStateController();

  // access canvas element from DOM with useRef -> won't trigger rerender when canvasRef changes
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  // establish web socket connection
  const { sendJsonMessage, lastMessage } = useWebSocket(WEB_SOCKET_URL, {
    queryParams: { username: props.username },
  });

  // process incoming messages from ws connection
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);

      if (data.type === "INITIAL_DATA") {
        data.voxels.forEach((voxel: any) => {
          addVoxelToScene(voxel);
        });
      } else if (data.type === "NEW_VOXEL") {
        addVoxelToScene(data.voxel);
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

      const voxelGeometry = new THREE.BoxGeometry(
        gridCellSize,
        gridCellSize,
        gridCellSize
      );

      const colorDecimal = parseInt(color.replace("#", ""), 16);
      const voxelBaseMat = new THREE.MeshMatcapMaterial({
        color: colorDecimal,
      });
      const voxelMesh = new THREE.Mesh(voxelGeometry, voxelBaseMat);
      voxelMesh.name = "voxel";

      voxelMesh.position.set(x, y, z);
      sceneRef.current?.add(voxelMesh);
    }
  };

  // helper function to send voxel data to server
  const placeVoxel = (x: number, y: number, z: number, color: string) => {
    sendJsonMessage({
      type: "NEW_VOXEL",
      x,
      y,
      z,
      color,
      username: props.username,
      timeCreated: Date.now(),
    });
  };

  useEffect(() => {
    console.log(`username: ${props.username}`);
    // scene, camera, renderer initalization
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      //   alpha: true,
    });

    // scene config
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0xffffff);
    renderer.setSize(window.innerWidth, innerHeight);

    const controls = createControls(camera, renderer);
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
      placeVoxel
    ); // render the scene

    // setup viewport gizmo
    const viewportGizmo = new ViewportGizmo(
      camera,
      renderer,
      viewportGizmoOptions
    );
    viewportGizmo.target = controls.target;

    // listeners for viewport gizmo
    const handleStart = () => {
      controls.enabled = false;
    };
    const handleEnd = () => {
      controls.enabled = true;
    };
    viewportGizmo.addEventListener("start", handleStart);
    viewportGizmo.addEventListener("end", handleEnd);
    controls.addEventListener("change", () => {
      viewportGizmo.update();
    });

    const animate = () => {
      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);
      viewportGizmo.render();

      if (controls.enabled) controls.update();
    };
    animate();

    return () => {
      // clean up event listeners to prevent duplicate events to trigger
      removeEventListeners();
      viewportGizmo.removeEventListener("start", handleStart);
      viewportGizmo.removeEventListener("end", handleEnd);
      controls.dispose();
    };
  }, []);

  // call handleUI after the components are mounted
  // lowk this is implemented hella bad but
  // useRef might be better since it might be readding listeners
  useEffect(() => {
    handleUI(setIsMouseOverUI);
  }, [setIsMouseOverUI]); // re-run when setter changes

  return (
    <>
      <ModeSlider />
      <Toolbar />
      <ColorPalette />
      <canvas ref={canvasRef} id="3canvas" />
    </>
  );
}

export default Canvas;

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createControls } from "./scripts/ViewportControls.js";
import { createScene } from "./scripts/Scene.js";
import ColorPalette from "./components/ColorPalette";
import Toolbar from "./components/Toolbar";
import { useStateController } from "./helpers/StateProvider.js";
import ModeSlider from "./components/ModeSlider";
import { handleUI } from "./scripts/UIHandler.js";
import useWebSocket from "react-use-websocket";
import { VOXEL_SIZE } from "./helpers/Constants.ts";
import { gridToWorldCoordinates } from "./helpers/ChangeCoords.ts";
import { QuickGuide } from "./components/QuickGuide.tsx";
import { FeedbackForm } from "./components/FeedbackForm.tsx";

function Canvas(props: { username: string }) {
  // access state variables through global provider
  const {
    currColorRef,
    setControls,
    isMouseOverUIRef,
    setIsMouseOverUI,
    isBuildModeRef,
    isServerOnlineRef,
    setIsServerOnline,
  } = useStateController();

  // access canvas element from DOM with useRef -> won't trigger rerender when canvasRef changes
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<any>(null);
  // keep updated list of all rendered objects
  const sceneObjectsRef = useRef<any[]>([]);

  const WEB_SOCKET_URL =
    import.meta.env.VITE_WEB_SOCKET_URL || "ws://127.0.0.1:8000";

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

      // Parse color from hex to decimal
      const colorDecimal = parseInt(color.replace("#", ""), 16);

      // const createGradientTexture = (colors: any) => {
      //   const size = colors.length; // Number of color stops
      //   const canvas = document.createElement("canvas");
      //   canvas.width = size;
      //   canvas.height = 1;

      //   const context = canvas.getContext("2d");

      //   // Create a gradient
      //   const gradient = context?.createLinearGradient(0, 0, size, 0);
      //   for (let i = 0; i < colors.length; i++) {
      //     gradient?.addColorStop(i / (size - 1), colors[i]); // Color stops
      //   }

      //   // Fill the canvas with the gradient
      //   //@ts-ignore
      //   context.fillStyle = gradient;
      //   context?.fillRect(0, 0, size, 1);

      //   // Create a Three.js texture from the canvas
      //   const texture = new THREE.CanvasTexture(canvas);
      //   texture.minFilter = THREE.NearestFilter; // Ensure sharp bands
      //   texture.magFilter = THREE.NearestFilter;
      //   texture.needsUpdate = true;

      //   return texture;
      // };

      // // Example colors for a toon shading gradient
      // const gradientColors = ["#000000", "#444444", "#888888", "#FFFFFF"];
      // const gradientTexture = createGradientTexture(gradientColors);

      // Create a toon material
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
      10000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      alpha: true,
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
    ); // render the scene

    const animate = () => {
      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);

      if (controls.enabled) controls.update();
    };
    animate();

    return () => {
      // clean up event listeners to prevent duplicate events to trigger
      removeEventListeners();
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
      <ModeSlider />
      <Toolbar />
      <ColorPalette controls={controlsRef} />
      <FeedbackForm />
      <canvas ref={canvasRef} id="3canvas" />
    </>
  );
}

export default Canvas;

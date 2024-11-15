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
import { gridToWorldCoordinates } from "./helpers/changeCoords.js";

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
      placeVoxel,
      sceneObjectsRef,
      isServerOnlineRef,
      deleteVoxel
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

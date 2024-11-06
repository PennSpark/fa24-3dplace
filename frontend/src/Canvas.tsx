import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createControls } from "./scripts/ViewportControls.js";
import { createScene } from "./scripts/Scene.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import { viewportGizmoOptions } from "./helpers/Constants.js";
import ColorPalette from "./components/ColorPalette";
import Toolbar from "./components/Toolbar";
import { useStateController } from "./helpers/StateProvider.js";
import ModeSlider from "./components/ModeSlider.js";
import { handleUI } from "./scripts/UIHandler.js";

function Canvas() {
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
      //   alpha: true,
    });

    // scene config
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0xffffff);
    renderer.setSize(window.innerWidth, innerHeight);

    const controls = createControls(camera, renderer);
    setControls(controls);
    controls.saveState();

    createScene(
      sceneRef.current,
      camera,
      renderer,
      currColorRef,
      isMouseOverUIRef,
      isBuildModeRef
    ); // render the scene

    // setup viewport gizmo
    const viewportGizmo = new ViewportGizmo(
      camera,
      renderer,
      viewportGizmoOptions
    );
    viewportGizmo.target = controls.target;
    // listeners for viewport gizmo
    viewportGizmo.addEventListener("start", () => {
      controls.enabled = false;
    });
    viewportGizmo.addEventListener("end", () => (controls.enabled = true));
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

import { useEffect } from "react";
import * as THREE from "three";
import { createControls } from "./scripts/ViewportControls.js";
import { createScene } from "./scripts/Scene.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import { viewportGizmoOptions } from "./helpers/Constants.js";

function Canvas() {
  useEffect(() => {
    // scene, camera, renderer initalization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    const canvas: any = document.getElementById("3canvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      //   alpha: true,
    });

    // scene config
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0xffffff);
    renderer.setSize(window.innerWidth, innerHeight);

    const controls = createControls(camera, renderer); // setup controls
    createScene(scene, camera, renderer); // render the scene

    // setup viewport gizmo
    const viewportGizmo = new ViewportGizmo(
      camera,
      renderer,
      viewportGizmoOptions
    );
    viewportGizmo.target = controls.target;
    // listenres for viewport gizmo
    viewportGizmo.addEventListener("start", () => {
      controls.enabled = false;
      console.log("init");
    });
    viewportGizmo.addEventListener("end", () => (controls.enabled = true));
    controls.addEventListener("change", () => {
      viewportGizmo.update();
    });

    const animate = (t = 0) => {
      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);
      viewportGizmo.render();

      if (controls.enabled) controls.update();
    };
    animate();
  }, []);

  return (
    <>
      <canvas id="3canvas" />
    </>
  );
}

export default Canvas;

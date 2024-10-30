import { useEffect, useState } from "react";
import * as THREE from "three";
import { createControls } from "./scripts/ViewportControls.js";
import { createScene } from "./scripts/Scene.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import { viewportGizmoOptions } from "./helpers/Constants.js";
import ColorPalette from "./components/ColorPalette";

function Canvas() {
  const usedColors: string[] = [
    "#FF1515",
    "#FF8000",
    "#FFFF33",
    "#CCFF99",
    "#00FF00",
    "#33FFFF",
    "#99CCFF",
    "#0000FF",
    "#CC00CC",
    "#CC99FF",
    "#FF33FF",
    "#FF007F",
    "#994C00",
    "#000000",
    "#FFFFFF",
  ];

  const [currColor, setCurrColor] = useState<string>("#000000");

  function setColor(arg: string) {
    setCurrColor(arg);
  }
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
    createScene(scene, camera, renderer, currColor); // render the scene

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
  }, [currColor]);
    
  return (
    <>
      <ColorPalette colors={usedColors} setColor={setColor} />
      <canvas id="3canvas" />
    </>
  );
}

export default Canvas;

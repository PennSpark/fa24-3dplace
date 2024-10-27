import { useEffect } from "react";
import * as THREE from "three";
import { createControls } from "./scripts/ViewportControls.js";
import { createScene } from "./scripts/Scene.js";

function Canvas() {
  useEffect(() => {
    // scene, camera, renderer initalization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
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
    createScene(scene, camera); // render the scene

    const animate = (t = 0) => {
      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();
      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);
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

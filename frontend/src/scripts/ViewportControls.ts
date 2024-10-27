import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { startCoords } from "../helpers/Constants";

export function createControls(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer
) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.panSpeed = 0.75;
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;

  controls.keys = {
    LEFT: "ArrowLeft",
    UP: "ArrowUp",
    RIGHT: "ArrowRight",
    BOTTOM: "ArrowDown",
  };

  controls.listenToKeyEvents(window);
  controls.keyPanSpeed = 10;

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
  };

  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(startCoords.x, startCoords.y, startCoords.z);
  controls.update();

  return controls;
}

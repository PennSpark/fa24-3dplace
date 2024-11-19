import * as THREE from "three";
import { CustomOrbitControls } from "../lib/CustomOrbitControls";
import { startCoords } from "../helpers/Constants";

export function createControls(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer
) {
  const controls = new CustomOrbitControls(camera, renderer.domElement);

  // set initial position of the camera
  camera.position.set(startCoords.x, startCoords.y, startCoords.z);
  // controls.update() must be called after any manual changes to the camera's transform
  controls.update();

  controls.panSpeed = 1;
  //   controls.enableDamping = true;
  //   controls.dampingFactor = 0.075;

  controls.listenToKeyEvents(window);
  controls.keyPanSpeed = 1;

  // left click rotate
  // right click pan
  // pinch or scroll wheel zoom
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  return controls;
}

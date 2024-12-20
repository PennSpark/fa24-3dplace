import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import {
  CAM_MAX_DISTANCE,
  CAM_MIN_DISTANCE,
  START_COORDS,
} from "../helpers/Constants";

export function createControls(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer
) {
  const controls = new OrbitControls(camera, renderer.domElement);

  // set initial position of the camera
  camera.position.set(START_COORDS.x, START_COORDS.y, START_COORDS.z);
  // controls.update() must be called after any manual changes to the camera's transform
  controls.update();

  controls.panSpeed = 1;
  controls.maxDistance = CAM_MAX_DISTANCE;
  controls.minDistance = CAM_MIN_DISTANCE;
  // controls.maxPolarAngle = Math.PI / 2;
  //   controls.enableDamping = true;
  //   controls.dampingFactor = 0.075;

  // keyboard controls
  controls.keys = {
    LEFT: "ArrowLeft",
    UP: "ArrowUp",
    RIGHT: "ArrowRight",
    BOTTOM: "ArrowDown",
  };

  controls.listenToKeyEvents(window);
  controls.keyPanSpeed = 10;

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

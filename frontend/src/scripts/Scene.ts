import * as THREE from "three";
import {
  BOARD_SIZE,
  DIMENSIONS,
  MAX_HEIGHT,
  MAX_XZ,
  MIN_XZ,
  VOXEL_SIZE,
} from "../helpers/Constants";
import { MutableRefObject } from "react";
import { worldToGridCoordinates } from "../helpers/ChangeCoords";

export function createScene(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer,
  currColorRef: MutableRefObject<string>,
  isMouseOverUIRef: MutableRefObject<boolean>,
  isBuildModeRef: MutableRefObject<boolean>,
  placeVoxel: Function,
  sceneObjects: MutableRefObject<any[]>,
  isServerOnlineRef: MutableRefObject<boolean>,
  deleteVoxel: Function
) {
  // create 2D plane mesh
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(DIMENSIONS.l, DIMENSIONS.w),
    new THREE.MeshBasicMaterial({ side: THREE.FrontSide, visible: false })
  );

  // plane mesh instantiates vertically so we rotate it 90 deg
  planeMesh.rotateX(-Math.PI / 2);
  planeMesh.name = "plane";
  scene.add(planeMesh);
  sceneObjects.current.push(planeMesh);

  // create grid overlay on plane
  const gridColor = new THREE.Color(0x888888);
  const grid = new THREE.GridHelper(
    DIMENSIONS.l,
    BOARD_SIZE,
    gridColor,
    gridColor
  );

  // Make the grid lines less intense by reducing opacity
  const gridMaterial = grid.material as THREE.Material;
  gridMaterial.opacity = 0.5; // Adjust for transparency
  gridMaterial.transparent = true;
  scene.add(grid);

  // --- voxel block mesh ---
  const voxelGeometry = new THREE.BoxGeometry(
    VOXEL_SIZE,
    VOXEL_SIZE,
    VOXEL_SIZE
  );

  // --- voxel highlight mesh ---
  const voxelPreviewMat = new THREE.MeshBasicMaterial({
    color: currColorRef.current,
    opacity: 0.5,
    transparent: true,
  });
  const voxelPreviewMesh = new THREE.Mesh(voxelGeometry, voxelPreviewMat);
  voxelPreviewMesh.name = "voxelPreview";
  scene.add(voxelPreviewMesh);

  // keep track of preview color
  let lastPreviewColor = currColorRef.current;

  // // LIGHTING!!! need this to show results of mesh material
  // const ambientLight = new THREE.AmbientLight(0xfff111, 1); // softer ambient light
  // scene.add(ambientLight);

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // balanced directional light
  // directionalLight.position.set(50, 50, 50);
  // directionalLight.castShadow = true;

  // // Configure shadows for the directional light
  // directionalLight.shadow.mapSize.width = 1024; // Increase shadow map resolution
  // directionalLight.shadow.mapSize.height = 1024;
  // directionalLight.shadow.camera.near = 0.5;
  // directionalLight.shadow.camera.far = 200;
  // directionalLight.shadow.camera.left = -50; // Adjust shadow frustum size
  // directionalLight.shadow.camera.right = 50;
  // directionalLight.shadow.camera.top = 50;
  // directionalLight.shadow.camera.bottom = -50;
  // scene.add(directionalLight);

  // // Optional: Use a helper to debug shadows during development
  // // const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // // scene.add(shadowHelper);

  // // Add a hemisphere light for a natural sky/ground effect
  // const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.7); // Sky color, ground color, intensity
  // hemisphereLight.position.set(0, 50, 0);
  // scene.add(hemisphereLight);

  // // Add a light helper (optional, for debugging during development)
  // // const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
  // // scene.add(lightHelper);

  // --- mouse raycast ---
  const mousePos = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // setup input/window listeners
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("resize", onWindowResize);

  // function to remove listeners
  const removeEventListeners = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("resize", onWindowResize);
  };

  // keep track of all voxel positions to ensure no duplicate voxels are placed
  const voxelPositions = new Set<string>();

  // helper function to restrict position.x.y.z values
  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function onMouseMove(event: { clientX: number; clientY: number }) {
    // toggle visibility of the voxel preview mesh
    // if transparent or not in build mode then don't show
    voxelPreviewMesh.visible =
      currColorRef.current !== "transparent" && isBuildModeRef.current;

    // update voxel preview color if it has changed
    // lowk this not effective, could be in useEffect callback w/ currColorRef in callback to update
    // but i dont got time for allat
    if (
      currColorRef.current !== lastPreviewColor &&
      currColorRef.current !== "transparent"
    ) {
      voxelPreviewMat.color.set(currColorRef.current);
      lastPreviewColor = currColorRef.current;
    }

    if (isBuildModeRef.current && currColorRef.current !== "transparent") {
      mousePos.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mousePos, camera);

      const intersects = raycaster.intersectObjects(
        sceneObjects.current,
        false
      );

      if (intersects.length > 0) {
        const intersect = intersects[0];

        // math to determine where voxel should be when hovering over faces of other voxels
        if (intersect.face)
          voxelPreviewMesh.position
            .copy(intersect.point)
            .add(intersect.face.normal);
        voxelPreviewMesh.position
          .divideScalar(VOXEL_SIZE)
          .floor()
          .multiplyScalar(VOXEL_SIZE)
          .addScalar(VOXEL_SIZE / 2);
      }

      // clamp pos.y so that it stays above plane and below MAX_HEIGHT limit
      voxelPreviewMesh.position.y = clamp(
        voxelPreviewMesh.position.y,
        VOXEL_SIZE / 2,
        MAX_HEIGHT - VOXEL_SIZE / 2
      );

      // clamp pos.x pos.z so that it doesn't extend outside board
      voxelPreviewMesh.position.x = clamp(
        voxelPreviewMesh.position.x,
        MIN_XZ,
        MAX_XZ
      );

      voxelPreviewMesh.position.z = clamp(
        voxelPreviewMesh.position.z,
        MIN_XZ,
        MAX_XZ
      );
    }
  }

  function onMouseDown(event: {
    clientX: number;
    clientY: number;
    button: number;
  }) {
    // only on left click place down block, and if mouse is not on UIelement
    if (
      event.button == 0 &&
      !isMouseOverUIRef.current &&
      isBuildModeRef.current
    ) {
      mousePos.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mousePos, camera);

      const intersects = raycaster.intersectObjects(
        sceneObjects.current,
        false
      );

      if (intersects.length > 0) {
        const intersect = intersects[0];

        // if on transparent color, then delete current voxel cursor is on
        if (currColorRef.current === "transparent") {
          if (intersect.object !== planeMesh) {
            const voxelToRemove = intersect.object;

            // database stores in grid coords --> need to convert to grid coords before sending to backend
            const { gridX, gridY, gridZ } = worldToGridCoordinates(
              voxelToRemove.position.x,
              voxelToRemove.position.y,
              voxelToRemove.position.z
            );

            // send data to backend -> triggers deletion on frontend when ws recieves msg
            deleteVoxel(gridX, gridY, gridZ);

            // delete from voxel postions set
            voxelPositions.delete(`${gridX},${gridY},${gridZ}`);

            // handles object deletion when server not running
            if (!isServerOnlineRef.current) {
              scene.remove(voxelToRemove);
              sceneObjects.current.splice(
                sceneObjects.current.indexOf(voxelToRemove),
                1
              );
            }
          }
        } else {
          // on click, create new voxel using ref.current and new mesh material
          const colorDecimal = parseInt(
            currColorRef.current.replace("#", ""),
            16
          );
          // right now matcap makes it so the lighting system doesnt affect material
          const voxelBaseMat = new THREE.MeshMatcapMaterial({
            color: colorDecimal,
          });
          const voxel = new THREE.Mesh(voxelGeometry, voxelBaseMat);
          voxel.name = "voxel";

          // math to determine where voxel should be on grid
          if (intersect.face)
            voxel.position.copy(intersect.point).add(intersect.face.normal);
          voxel.position
            .divideScalar(VOXEL_SIZE)
            .floor()
            .multiplyScalar(VOXEL_SIZE)
            .addScalar(VOXEL_SIZE / 2);

          // clamp pos.y so that it stays above plane and below MAX_HEIGHT limit
          voxel.position.y = clamp(
            voxel.position.y,
            VOXEL_SIZE / 2,
            MAX_HEIGHT - VOXEL_SIZE / 2
          );

          voxel.position.x = clamp(voxel.position.x, MIN_XZ, MAX_XZ);

          voxel.position.z = clamp(voxel.position.z, MIN_XZ, MAX_XZ);

          // database stores coords in grid --> need to convert to grid coords
          const { gridX, gridY, gridZ } = worldToGridCoordinates(
            voxel.position.x,
            voxel.position.y,
            voxel.position.z
          );

          // check if voxel already exists at specified location
          if (!voxelPositions.has(`${gridX},${gridY},${gridZ}`)) {
            placeVoxel(gridX, gridY, gridZ, currColorRef.current); // proceed with placement
            voxelPositions.add(`${gridX},${gridY},${gridZ}`); // add voxel pos to set to keep track
            if (!isServerOnlineRef.current) {
              scene.add(voxel);
              sceneObjects.current.push(voxel);
            }
          } else {
            console.log("Voxel already exists at this position!");
          }
        }
      }
    }
  }

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // update the renderer size
    renderer.setSize(width, height);

    // update the camera aspect ratio
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  // return back to canvas.tsx
  return removeEventListeners;
}

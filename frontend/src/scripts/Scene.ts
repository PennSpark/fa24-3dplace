import * as THREE from "three";
import { dimensions, gridCellSize, gridSideLength } from "../helpers/Constants";
import { MutableRefObject } from "react";

export function createScene(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer,
  currColorRef: MutableRefObject<string>
) {
  // create 2D plane mesh
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(dimensions.l, dimensions.w),
    new THREE.MeshBasicMaterial({ side: THREE.FrontSide, visible: false })
  );

  // plane mesh instantiates vertically so we rotate it 90 deg
  planeMesh.rotateX(-Math.PI / 2);
  planeMesh.name = "plane";
  scene.add(planeMesh);

  // create grid overlay on plane
  const grid = new THREE.GridHelper(dimensions.l, gridSideLength);
  scene.add(grid);

  // --- voxel block mesh ---
  const voxelGeometry = new THREE.BoxGeometry(
    gridCellSize,
    gridCellSize,
    gridCellSize
  );

  // --- voxel highlight mesh ---
  const voxelPreviewMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.5,
    transparent: true,
  });
  const voxelPreviewMesh = new THREE.Mesh(voxelGeometry, voxelPreviewMat);
  voxelPreviewMesh.name = "voxelPreview";
  scene.add(voxelPreviewMesh);

  // keep updated list of all rendered objects
  const objects: any[] = [];
  objects.push(planeMesh);

  // --- mouse raycast ---
  const mousePos = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // setup input/window listeners
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("resize", onWindowResize);

  function onMouseMove(event: { clientX: number; clientY: number }) {
    mousePos.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mousePos, camera);

    const intersects = raycaster.intersectObjects(objects, false);

    if (intersects.length > 0) {
      const intersect = intersects[0];

      if (intersect.face)
        voxelPreviewMesh.position
          .copy(intersect.point)
          .add(intersect.face.normal);
      voxelPreviewMesh.position
        .divideScalar(gridCellSize)
        .floor()
        .multiplyScalar(gridCellSize)
        .addScalar(gridCellSize / 2);
    }

    // ensure the y-coord is above the plane
    voxelPreviewMesh.position.y = Math.max(
      voxelPreviewMesh.position.y,
      gridCellSize / 2
    );
  }

  function onMouseDown(event: { clientX: number; clientY: number }) {
    mousePos.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mousePos, camera);

    const intersects = raycaster.intersectObjects(objects, false);

    if (intersects.length > 0) {
      const intersect = intersects[0];

      // on click, create new voxel using ref.current and new mesh material
      const colorDecimal = parseInt(currColorRef.current.replace("#", ""), 16);
      const voxelBaseMat = new THREE.MeshBasicMaterial({ color: colorDecimal });
      const voxelMesh = new THREE.Mesh(voxelGeometry, voxelBaseMat);
      voxelMesh.name = "voxel";

      const voxel = new THREE.Mesh(voxelGeometry, voxelBaseMat);

      if (intersect.face)
        voxel.position.copy(intersect.point).add(intersect.face.normal);
      voxel.position
        .divideScalar(gridCellSize)
        .floor()
        .multiplyScalar(gridCellSize)
        .addScalar(gridCellSize / 2);

      // ensure the y-coord is above the plane
      voxel.position.y = Math.max(voxel.position.y, gridCellSize / 2);
      scene.add(voxel);
      objects.push(voxel);
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; // update camera aspect ratio
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); // update renderer size
  }
}

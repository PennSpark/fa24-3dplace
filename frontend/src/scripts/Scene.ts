import * as THREE from "three";
import { dimensions, gridCellSize, gridSideLength } from "../helpers/Constants";
import { MutableRefObject } from "react";

export function createScene(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer,
  currColorRef: MutableRefObject<string>,
<<<<<<< Updated upstream
  isMouseOverUIRef: MutableRefObject<boolean>
=======
  isBuildModeRef: MutableRefObject<boolean>
>>>>>>> Stashed changes
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

  // LIGHTING!!! need this to show results of mesh material
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft ambient light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // strong directional light
  directionalLight.position.set(50, 50, 50);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // shows directional light helper
  const lightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1,
    0xf00000
  );
  scene.add(lightHelper);

  // --- mouse raycast ---
  const mousePos = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // setup input/window listeners
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("resize", onWindowResize);

  function onMouseMove(event: { clientX: number; clientY: number }) {
    if (isBuildModeRef.current) {
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
  }

<<<<<<< Updated upstream
  function onMouseDown(event: {
    clientX: number;
    clientY: number;
    button: number;
  }) {
    // only on left click place down block, and if mouse is not on UIelement
    if (event.button == 0 && !isMouseOverUIRef.current) {
=======
  function onMouseDown(event: { clientX: number; clientY: number }) {
    // only add if its in build mode, and comfirmed
    if (isBuildModeRef.current) {
>>>>>>> Stashed changes
      mousePos.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mousePos, camera);

      const intersects = raycaster.intersectObjects(objects, false);

<<<<<<< Updated upstream
=======
      
>>>>>>> Stashed changes
      if (intersects.length > 0) {
        const intersect = intersects[0];

        // on click, create new voxel using ref.current and new mesh material
<<<<<<< Updated upstream
        const colorDecimal = parseInt(
          currColorRef.current.replace("#", ""),
          16
        );
=======
        const colorDecimal = parseInt(currColorRef.current.replace("#", ""), 16);
>>>>>>> Stashed changes
        // right now matcap makes it so the lighting system doesnt affect material
        const voxelBaseMat = new THREE.MeshMatcapMaterial({
          color: colorDecimal,
        });
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
<<<<<<< Updated upstream
=======
      
>>>>>>> Stashed changes
        scene.add(voxel);
        objects.push(voxel);
      }
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; // update camera aspect ratio
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); // update renderer size
  }
}

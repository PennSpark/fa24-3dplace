import * as THREE from "three";
import { dimensions, gridCellSize, gridSideLength } from "../helpers/Constants";
import { MutableRefObject } from "react";
import { worldToGridCoordinates } from "../helpers/changeCoords";

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
    new THREE.PlaneGeometry(dimensions.l, dimensions.w),
    new THREE.MeshBasicMaterial({ side: THREE.FrontSide, visible: false })
  );

  // plane mesh instantiates vertically so we rotate it 90 deg
  planeMesh.rotateX(-Math.PI / 2);
  planeMesh.name = "plane";
  scene.add(planeMesh);
  sceneObjects.current.push(planeMesh);

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
    color: currColorRef.current,
    opacity: 0.5,
    transparent: true,
  });
  const voxelPreviewMesh = new THREE.Mesh(voxelGeometry, voxelPreviewMat);
  voxelPreviewMesh.name = "voxelPreview";
  scene.add(voxelPreviewMesh);

  // keep track of preview color
  let lastPreviewColor = currColorRef.current;

  // LIGHTING!!! need this to show results of mesh material
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft ambient light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // strong directional light
  directionalLight.position.set(50, 50, 50);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // // shows directional light helper
  // const lightHelper = new THREE.DirectionalLightHelper(
  //   directionalLight,
  //   1,
  //   0xf00000
  // );
  // scene.add(lightHelper);

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
            .divideScalar(gridCellSize)
            .floor()
            .multiplyScalar(gridCellSize)
            .addScalar(gridCellSize / 2);

          // ensure the y-coord is above the plane
          voxel.position.y = Math.max(voxel.position.y, gridCellSize / 2);

          // database stores coords in grid --> need to convert to grid coords
          const { gridX, gridY, gridZ } = worldToGridCoordinates(
            voxel.position.x,
            voxel.position.y,
            voxel.position.z
          );

          // send data to backend -> triggers block placement on frontend when ws recieves data
          placeVoxel(gridX, gridY, gridZ, currColorRef.current);

          // handles object creation when server not running
          if (!isServerOnlineRef.current) {
            scene.add(voxel);
            sceneObjects.current.push(voxel);
          }
        }
      }
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; // update camera aspect ratio
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); // update renderer size
  }

  // return back to canvas.tsx
  return removeEventListeners;
}

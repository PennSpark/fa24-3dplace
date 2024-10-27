import * as THREE from "three";
import { dimensions } from "../helpers/Constants";

export function createScene(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) {
  // --- create plane mesh ---
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(dimensions.l, dimensions.w),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, visible: false })
  );
  // plane mesh instantiates vertically so we rotate it 90 deg
  planeMesh.rotateX(-Math.PI / 2);
  planeMesh.name = "plane";
  scene.add(planeMesh);

  // --- create grid overlay on plane ---
  const grid = new THREE.GridHelper(dimensions.l, dimensions.w);
  scene.add(grid);

  // ---- create selected grid cell mesh ----
  const cellMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0xff6961 })
  );
  cellMesh.rotateX(-Math.PI / 2);
  // cell mesh starts at origin so align w/ grid mesh by providing offset, half of grid cell length/width
  cellMesh.position.set(0.5, 0, 0.5);
  scene.add(cellMesh);

  // --- mouse raycast ---
  const mousePos = new THREE.Vector2();
  const raycast = new THREE.Raycaster();
  let intersections: any;

  window.addEventListener("mousemove", (event) => {
    mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycast.setFromCamera(mousePos, camera);
    intersections = raycast.intersectObjects(scene.children);
    intersections.forEach((i: any) => {
      if (i.object.name === "plane") {
        // calculate position of highlighted cell
        //TODO add explanation for math
        const cellPos = new THREE.Vector3()
          .copy(i.point)
          .floor()
          .addScalar(0.5);
        cellMesh.position.set(cellPos.x, 0, cellPos.z);
      }
    });
  });

  // --- voxel block mesh ---
  // TODO allow users to pick a color to change color of block
  const voxelMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x000 })
  );
  voxelMesh.name = "voxel";

  const existingVoxels: any[] = [];

  window.addEventListener("mousedown", (event) => {
    // check if a voxel already exists at current position
    const voxelExists: boolean = existingVoxels.find((v) => {
      return (
        v.position.x === cellMesh.position.x &&
        v.position.y === cellMesh.position.y &&
        v.position.z === cellMesh.position.z
      );
    });

    // ensure only left click and voxel doesn't already exist at current loc
    if (event.button === 0 && !voxelExists) {
      intersections.forEach((i: any) => {
        if (i.object.name === "plane") {
          // create dupe of voxel mesh to place in highlighted cell
          const voxel = voxelMesh.clone();
          voxel.position.set(cellMesh.position.x, 0.5, cellMesh.position.z);
          scene.add(voxel);
          existingVoxels.push(voxel);
        }
      });
    }
  });
}

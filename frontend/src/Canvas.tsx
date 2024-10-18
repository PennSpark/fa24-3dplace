import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

function Canvas() {
  useEffect(() => {
    // --- constants ---
    const dimensions = {
      l: 200,
      w: 200,
    };
    const startCoords = {
      x: 10,
      y: 7.5,
      z: -15,
    };

    // --- scene setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // --- camera setup ---
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(startCoords.x, startCoords.y, startCoords.z);

    // --- renderer setup ---
    const canvas: any = document.getElementById("3canvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      //   alpha: true,
    });
    renderer.setSize(window.innerWidth / 1, innerHeight / 1);
    document.body.appendChild(renderer.domElement);

    //! --- orbital controls ---
    const controls = new OrbitControls(camera, renderer.domElement);

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
    const voxelMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x000 })
    );

    window.addEventListener("mousedown", () => {
      intersections.forEach((i: any) => {
        if (i.object.name === "plane") {
          // create dupe of voxel mesh to place in highlighted cell
          // TODO multiple voxels can be placed inside one square creating unnecssary copies
          const voxel = voxelMesh.clone();
          voxel.position.set(cellMesh.position.x, 0.5, cellMesh.position.z);
          scene.add(voxel);
        }
      });
    });

    const animate = (t = 0) => {
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
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

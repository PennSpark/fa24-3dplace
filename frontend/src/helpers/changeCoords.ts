import { BOARD_SIZE, VOXEL_SIZE } from "./Constants";

const blockLength = VOXEL_SIZE; // the length of each voxel block
const boardBound = (VOXEL_SIZE * BOARD_SIZE) / 2; // half of the full board size

export const gridToWorldCoordinates = (
  gridX: number,
  gridY: number,
  gridZ: number
) => {
  // normalize grid coordinates to world coordinates
  // bottom left starts at (0,0) and top right ends with (127, 127) --> assuming canvas is 128x128
  const worldX = gridX * blockLength - boardBound + blockLength / 2;
  const worldY = gridY * blockLength + blockLength / 2;
  const worldZ = -(gridZ * blockLength - boardBound + blockLength / 2);

  return { worldX, worldY, worldZ };
};

export const worldToGridCoordinates = (
  worldX: number,
  worldY: number,
  worldZ: number
) => {
  // normalize world coordinates to grid coordinates
  const gridX = Math.floor(
    (worldX + boardBound - blockLength / 2) / blockLength
  );
  const gridY = Math.floor((worldY - blockLength / 2) / blockLength);
  const gridZ = Math.floor(
    (-worldZ + boardBound - blockLength / 2) / blockLength
  );

  return { gridX, gridY, gridZ };
};

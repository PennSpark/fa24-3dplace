// board init values
export const VOXEL_SIZE = 25; // needs to be bigger because it fixes glitchyness with mouse raycast
export const BOARD_SIZE = 128; // need to change in backend serializer.js as well
export const BOARD_HEIGHT = 32; // ceiling limit to canvas

// constants used for clamping
export const MAX_HEIGHT = BOARD_HEIGHT * VOXEL_SIZE;
export const MAX_WIDTH = BOARD_SIZE * VOXEL_SIZE;
export const MIN_XZ = -MAX_WIDTH / 2 + VOXEL_SIZE / 2;
export const MAX_XZ = MAX_WIDTH / 2 - VOXEL_SIZE / 2;

export const DIMENSIONS = {
  l: VOXEL_SIZE * BOARD_SIZE,
  w: VOXEL_SIZE * BOARD_SIZE,
};

export const startCoords = {
  x: 216,
  y: 200,
  z: 200,
};

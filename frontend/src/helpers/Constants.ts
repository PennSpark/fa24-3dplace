// determines side of voxel blocks
// needs to be bigger because it fixes glitchyness with mouse raycast
export const gridCellSize = 25;
export const gridSideLength = 100;

export const dimensions = {
  l: gridCellSize * gridSideLength,
  w: gridCellSize * gridSideLength,
};

export const startCoords = {
  x: 216,
  y: 200,
  z: 200,
};

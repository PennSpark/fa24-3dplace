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

export const viewportGizmoOptions = {
  placement: "bottom-left",
  size: 150,
  lineWidth: 3,
  offset: {
    top: 0,
    left: 20,
    right: 0,
    bottom: 10,
  },
  font: {
    family: "helvetica",
    weight: 900,
  },
  resolution: 64,
  backgroundSphere: {
    enabled: true,
    color: 0,
    opacity: 0.2,
  },
  x: {
    text: "X",
    drawLine: true,
    border: false,
    colors: {
      main: "#FF2E2E",
      hover: "#FFFFFF",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  y: {
    text: "Y",
    drawLine: true,
    border: false,
    colors: {
      main: "#54F000",
      hover: "#FFFFFF",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  z: {
    text: "Z",
    drawLine: true,
    border: false,
    colors: {
      main: "#6181FF",
      hover: "#FFFFFF",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  nx: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#EE1B49",
      hover: "#FFFFFF",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  ny: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#48F000",
      hover: "#FFFFFF",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  nz: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#5451FB",
      hover: "#FFFFFF",
      text: "#000000",
      hoverText: "#000000",
    },
  },
};

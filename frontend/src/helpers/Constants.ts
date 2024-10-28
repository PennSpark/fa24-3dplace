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

export const viewportGizmoOptions = {
  placement: "bottom-left",
  size: 150,
  lineWidth: 5,
  offset: {
    top: 0,
    left: 15,
    right: 0,
    bottom: 15,
  },
  font: {
    family: "helvetica",
    weight: 900,
  },
  resolution: 256,
  backgroundSphere: {
    enabled: false,
    color: 0,
    opacity: 0.25,
  },
  x: {
    text: "X",
    drawLine: true,
    border: false,
    colors: {
      main: "#ff7f9b",
      hover: "#ff0000",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  y: {
    text: "Y",
    drawLine: true,
    border: false,
    colors: {
      main: "#c2ee00",
      hover: "#00ff00",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  z: {
    text: "Z",
    drawLine: true,
    border: false,
    colors: {
      main: "#73c5ff",
      hover: "#0000ff",
      text: "#000000",
      hoverText: "#ffffff",
    },
  },
  nx: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#ff7f9b",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  ny: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#c2ee00",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  nz: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#73c5ff",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
};

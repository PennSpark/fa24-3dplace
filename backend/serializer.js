const BOARD_SIZE = 128; // change board size --> needs to be powers of 2
const BOARD_HEIGHT = 32;

export const colorsToBin = {
  "#EB1800": "0000",
  "#FF7105": "0001",
  "#FEE400": "0010",
  "#BFEF45": "0011",
  "#00CC00": "0100",
  "#166F00": "0101",
  "#241FD3": "0110",
  "#00B2FF": "0111",
  "#7900C3": "1000",
  "#F032E6": "1001",
  "#FFA4D1": "1010",
  "#D4852A": "1011",
  "#63300F": "1100",
  "#000000": "1101",
  "#E0E0E0": "1110",
  transparent: "1111",
};

export const binToColors = Object.fromEntries(
  Object.entries(colorsToBin).map(([key, value]) => [value, key])
);

// helper function to calculate the offset for a voxel
function getOffset(x, y, z) {
  return x + BOARD_SIZE * z + BOARD_SIZE * BOARD_SIZE * y;
}

// take collection of objects and return bit representation of board
export const getSerializedVoxels = async (voxels) => {
  // fill in "transparent" if the voxel does not exist at thec position
  let binaryVoxelsArray = new Array(
    BOARD_SIZE * BOARD_SIZE * BOARD_HEIGHT
  ).fill("1111");

  voxels.forEach((v) => {
    // get the binary 4-bit int for color of voxel
    let colorBinary = colorsToBin[v.color];

    // store this 4-bit at calculated the offset based on the voxel's position
    const offset = getOffset(v.x, v.y, v.z);
    binaryVoxelsArray[offset] = colorBinary;
  });

  // return the full bitfield (binary string) of the serialized voxels
  return binaryVoxelsArray.join("");
};

// take bit representation of board and return array of voxels
export const deserializeVoxels = (binaryVoxels) => {
  const voxelData = [];

  // loop through the binary string in increments of 4-bits
  for (let offset = 0; offset < binaryVoxels.length; offset += 4) {
    const colorBinary = binaryVoxels.slice(offset, offset + 4);

    // skip since voxel is "transparent" so doesn't exist
    if (colorBinary === "1111") {
      continue;
    }

    // Calculate x, y, z based on the offset (reverse of the getOffset function)
    const linearIndex = offset / 4; // Each voxel takes 4 bits, so divide by 4 to get the index

    // TODO y-value is screwed but x and z work
    const y = Math.floor(linearIndex / (BOARD_SIZE * BOARD_SIZE)); // Find which "layer" of height y the index is in
    const remainingAfterY = linearIndex % (BOARD_SIZE * BOARD_SIZE);

    const z = Math.floor(remainingAfterY / BOARD_SIZE); // Determine the depth position (z)
    const x = remainingAfterY % BOARD_SIZE; // Determine the horizontal position (x)
    // Convert the binary color to a hex color using the binToColors map
    const color = binToColors[colorBinary];

    // Push the voxel object to the voxelData array
    voxelData.push({ x, y, z, color });
  }

  return voxelData;
};

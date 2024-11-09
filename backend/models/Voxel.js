const mongoose = require("mongoose");

const VoxelSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  z: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
    match: /^#([0-9A-F]{3}){1,2}$/i, // regex to validate hex color codes
  },
  creatorName: {
    type: String,
    required: true,
  },
  timeCreated: {
    type: Date,
    default: Date.now, // auto sets the timestamp when the voxel is created
  },
});

module.exports = mongoose.model("Voxel", VoxelSchema);

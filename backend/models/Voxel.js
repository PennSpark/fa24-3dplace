import { Schema, mongoose } from "mongoose";

const VoxelSchema = new Schema(
  {
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
    },
    creatorName: {
      type: String,
      required: true,
    },
    timeCreated: {
      type: Date,
      default: Date.now, // auto sets the timestamp when the voxel is created
    },
  },
  {
    collection: "voxels", // specify the collection name here
  }
);

const Voxel = mongoose.model("Voxel", VoxelSchema);
export default Voxel;

import { connect } from "mongoose";
const uri = process.env.DB_URL || "mongodb://localhost:27017/3dplace";

const dbConnect = async () => {
  try {
    await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default dbConnect;

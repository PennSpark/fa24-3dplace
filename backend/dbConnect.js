const mongoose = require("mongoose");
const uri = process.env.MONGO_URL || "mongodb://localhost:27017/3dplace";

const dbConnect = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = dbConnect;

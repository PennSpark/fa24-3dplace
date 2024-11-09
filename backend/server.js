const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConnect = require("./dbConnect.js");

const app = express();
const corsOptions = {
  origin: ["https://localhost:5173", "https://3dPlace.com"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Create the model
const User = mongoose.model("User", userSchema);

app.post("newUser", async (req, res) => {
  try {
    const newUser = new User(req.body());
    await newUser.save();
    res.status(201).send("User updated successfully!");
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("retrieveState", (req, res) => {
  try {
  } catch (error) {
    res.status(404).send(error);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, `Server listening on port ${PORT}!`);

// require dependencies
const http = require("http");
const { WebSocketServer } = require("ws");
const cors = require("cors");
const uuidv4 = require("uuid").v4;
const url = require("url");
const dbConnect = require("./dbConnect.js"); // init mongo database
const Voxel = require("./models/Voxel"); // mongodb model for voxel data

// initialize server
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = process.env.PORT || 8000;
dbConnect();

const connections = {}; // keep track of current connections - stores lots of other metadata
const users = {}; // keep track of users - stores our own data that we care about
const voxelData = []; // local websocket copy of all voxels on canvas - can push to mongodb?

// broadcast, send msg to all clients, so just iterate over connections
const broadcast = (message) => {
  for (const uuid in connections) {
    connections[uuid].send(JSON.stringify(message));
  }
};

// connection event handlers
const handleMessage = async (bytes, uuid) => {
  try {
    const data = JSON.parse(bytes.toString());
    console.log(data);

    // remember we define {} format of data
    if (data.type === "NEW_VOXEL") {
      const { x, y, z, color, creatorName, timeCreated } = data;
      // const username = users[uuid].username;

      // locally push new voxel created
      const newVoxel = { x, y, z, color, creatorName, timeCreated };
      voxelData.push(newVoxel);

      // // save new voxel to MongoDB
      // const newVoxel = await Voxel.create({
      //   x,
      //   y,
      //   z,
      //   color,
      //   creatorName,
      //   timeCreated,
      // });

      // defining {} format of data
      const message = { type: "NEW_VOXEL", voxel: newVoxel };
      broadcast(message);
    }
  } catch (error) {
    console.error("Error handling message: ", error);
    connections[uuid].send(
      JSON.stringify({
        type: "ERROR",
        message: "An error occurred while processing the voxel.",
      })
    );
  }
};

const handleClose = (uuid) => {
  console.log("Connection closed:", uuid);
  delete connections[uuid];
  delete users[uuid];

  //? do we need to send broadcast to update when user disconnects
  broadcast({ type: "USER_DISCONNECT", uuid });
};

// listen for connections using websockets
wsServer.on("connection", async (connection, request) => {
  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4(); // generate unique identifier for every user
  console.log(`${username} connected with UUID: ${uuid}`);

  connections[uuid] = connection; // store (key, value) pair => (uuid, connection)
  users[uuid] = {
    username: username,
    state: {}, // any real-time data that user contains? do we have, maybe maybe not?
  };

  // send initial voxel data to new connection from local copy of data
  connection.send(JSON.stringify({ type: "INITIAL_DATA", voxels: voxelData }));

  // // send initial voxel data to the client from database
  // try {
  //   const voxels = await Voxel.find(); // Fetch all voxels from MongoDB
  //   connection.send(JSON.stringify({ type: "INITIAL_DATA", voxels }));
  // } catch (error) {
  //   console.error("Error fetching initial voxel data:", error);
  //   connection.send(
  //     JSON.stringify({ type: "ERROR", message: "Failed to load initial data" })
  //   );
  // }

  // the {} format of message, we will define so dw
  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log("websocket server is running on port: " + port);
});

// const express = require("express");
// const bodyParser = require("body-parser");

// const app = express();
// const corsOptions = {
//   origin: ["https://localhost:5173", "https://3dPlace.com"],
// };
// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// });

// // Create the model
// const User = mongoose.model("User", userSchema);

// app.post("newUser", async (req, res) => {
//   try {
//     const newUser = new User(req.body());
//     await newUser.save();
//     res.status(201).send("User updated successfully!");
//   } catch (error) {
//     res.status(404).send(error);
//   }
// });

// app.get("retrieveState", (req, res) => {
//   try {
//   } catch (error) {
//     res.status(404).send(error);
//   }
// });

// const PORT = process.env.PORT || 8080;

// app.listen(PORT, `Server listening on port ${PORT}!`);

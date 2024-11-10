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
const voxelData = []; // local websocket copy of all voxels on canvas - pull from mongo on init
let isDatabaseOnline = false;

// load initial voxel data from MongoDB when the server starts
const initializeVoxelData = async () => {
  try {
    const voxels = await Voxel.find({}); // fetch all voxels from MongoDB
    voxelData.push(...voxels);
    console.log("Voxel data initialized from MongoDB.");
    isDatabaseOnline = true;
  } catch (error) {
    console.error("Error initializing voxel data:", error);
  }
};

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

      const newVoxel = {
        x,
        y,
        z,
        color,
        creatorName,
        timeCreated,
      };

      // save new voxel to MongoDB
      if (isDatabaseOnline) await Voxel.create(newVoxel);

      // locally push new voxel created
      voxelData.push(newVoxel);

      // defining {} format of data
      const message = { type: "NEW_VOXEL", voxel: newVoxel };
      broadcast(message);
    }

    if (data.type === "DELETE_VOXEL") {
      const { x, y, z } = data; // extra the position of the voxel to delete

      // find voxel from the local data on server
      const index = voxelData.findIndex(
        (voxel) => voxel.x === x && voxel.y === y && voxel.z === z
      );

      if (index !== -1) {
        // remove the voxel from the local data on server
        const deletedVoxel = voxelData.splice(index, 1)[0];

        // delete from mongodb
        if (isDatabaseOnline) await Voxel.deleteOne({ x, y, z });

        // broadcast the voxel deletion to all clients
        const message = { type: "DELETE_VOXEL", voxel: deletedVoxel };
        broadcast(message);
      } else {
        // if voxel not found send error response
        connections[uuid].send(
          JSON.stringify({
            type: "ERROR",
            message: "Voxel not found for deletion.",
          })
        );
      }
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

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log("websocket server is running on port: " + port);
  initializeVoxelData(); // populate voxelData at server start
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

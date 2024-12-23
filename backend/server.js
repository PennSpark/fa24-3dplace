// import dependencies
import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import url from "url";
import Voxel from "./models/Voxel.js"; // mongoDB model for voxel data
import redis from "redis";
import dbConnect from "./dbConnect.js";
import {
  addSerializedVoxel,
  deleteSerializedVoxel,
  deserializeVoxels,
  getSerializedVoxels,
} from "./serializer.js";

// initialize server
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = process.env.SERVER_PORT || 8000;

// connect to Redis
const REDIS_BITFIELD_KEY = "board";
let isRedisOnline = false;
let redisClient;
let binaryVoxelBoard;

const connectToRedis = async () => {
  try {
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
    isRedisOnline = true; // redis is online and connected
  } catch (err) {
    isRedisOnline = false; // redis connection failed
  }
};

connectToRedis().catch((err) => {
  console.log("Redis failed init" + err);
});

// connect to database
let isDatabaseOnline = false;
await dbConnect().then((isDatabaseOnline = true));

const connections = {}; // keep track of current connections - stores lots of other metadata
const users = {}; // keep track of users - stores our own data that we care about

// local server copy of all voxels on canvas - pull from mongo on init
const voxelData = [];

// ---- SIMULATION TIMELAPSE CODE ----
// let counter = 0;
// let allVoxels = [];
// ---- SIMULATION TIMELAPSE CODE ----

// initialize local server data, pulling from mongoDB
const initializeVoxelData = async () => {
  try {
    // try fetching data from redis cache
    try {
      if (isRedisOnline) {
        binaryVoxelBoard = await redisClient.get(REDIS_BITFIELD_KEY);
      }
    } catch (err) {
      console.error("Error fetching from Redis:", err);
      binaryVoxelBoard = null;
    }

    if (binaryVoxelBoard) {
      // if data is found then deserialize and update voxelData[]
      const vxs = deserializeVoxels(binaryVoxelBoard);
      voxelData.push(...vxs);
      console.log(`Voxel data initialized from Redis: ${vxs.length} voxels.`);
    } else {
      // if no data, fetch from MongoDB
      console.log("Voxel data not found from Redis. Fetching from Mongo");
      const pipeline = [
        {
          $sort: { timeCreated: -1 }, // sort by most recent first
        },
        {
          $group: {
            _id: { x: "$x", y: "$y", z: "$z" },
            x: { $first: "$x" },
            y: { $first: "$y" },
            z: { $first: "$z" },
            color: { $first: "$color" },
            creatorName: { $first: "$creatorName" },
            timeCreated: { $first: "$timeCreated" },
          },
        },
        {
          $match: { color: { $ne: "transparent" } }, // exclude deleted voxels
        },
      ];
      const vxs = await Voxel.aggregate(pipeline);

      // serialize and cache binary voxel data into Redis if it is online
      if (isRedisOnline) {
        binaryVoxelBoard = await getSerializedVoxels(vxs);
        await redisClient.set(REDIS_BITFIELD_KEY, binaryVoxelBoard);
        console.log("Set binary data in Redis.");
      }
      // load for local server use
      voxelData.push(...vxs);
      console.log("Voxel data initialized from MongoDB.");
    }

    // ---- SIMULATION TIMELAPSE CODE ----
    // allVoxels = await Voxel.find({}).sort({ timeCreated: 1 });
    // console.log("Voxel data initialized:", allVoxels.length, "voxels fetched.");
    // ---- SIMULATION TIMELAPSE CODE ----
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

      // update and cache to redis
      if (isRedisOnline) {
        try {
          // rewriting board binary to reflect voxel addition
          // lowk using bitfield operation set or incrby or more efficient but i cant be asked
          binaryVoxelBoard = addSerializedVoxel(binaryVoxelBoard, newVoxel);
          redisClient.set(REDIS_BITFIELD_KEY, binaryVoxelBoard);
        } catch (error) {
          console.error("Error updating Redis cache with new voxel:", error);
        }
      }

      // defining {} format of data
      const message = { type: "NEW_VOXEL", voxel: newVoxel };
      broadcast(message);
    }

    if (data.type === "DELETE_VOXEL") {
      const { x, y, z, color, creatorName, timeCreated } = data; // extract the position of the voxel to delete

      // find voxel from the local data on server
      const index = voxelData.findIndex(
        (voxel) => voxel.x === x && voxel.y === y && voxel.z === z
      );

      if (index !== -1) {
        // store transparent voxel to keep track of blocks that have been deleted
        const transparentVoxel = {
          x,
          y,
          z,
          color,
          creatorName,
          timeCreated,
        };

        // storing transparent voxel for memory purposes
        if (isDatabaseOnline) await Voxel.create(transparentVoxel);

        // remove the voxel from the local data on server
        const deletedVoxel = voxelData.splice(index, 1)[0];

        // update and cache to redis
        if (isRedisOnline) {
          try {
            // rewriting board binary to reflect voxel deletion
            // lowk using bitfield operation set or incrby or more efficient but i cant be asked
            binaryVoxelBoard = deleteSerializedVoxel(
              binaryVoxelBoard,
              deletedVoxel
            );
            redisClient.set(REDIS_BITFIELD_KEY, binaryVoxelBoard);
          } catch (error) {
            console.error("Error updating Redis cache with new voxel:", error);
          }
        }

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

// ---- SIMULATION TIMELAPSE CODE ---- ///
// // have to comment out some initializeVoxelData() code
// const fetchVoxelData = async () => {
//   try {
//     if (counter >= allVoxels.length) {
//       console.log("All voxels have been broadcasted.");
//       return;
//     }

//     let v = allVoxels[counter];
//     let message;
//     if (v.color === "transparent") {
//       message = { type: "DELETE_VOXEL", voxel: v };
//     } else {
//       message = { type: "NEW_VOXEL", voxel: v };
//     }
//     console.log("Broadcasting voxel:", message);
//     broadcast(message);
//     counter++;
//   } catch (error) {
//     console.error("Error fetching voxel data:", error);
//   }
// };

// // init data and run fetch voxel every REFRESH_RATE
// const REFRESH_RATE = 2; // milliseconds
// const DELAY_BEFORE_FETCH = 10000;
// (async () => {
//   await initializeVoxelData();
//   setTimeout(() => {
//     setInterval(fetchVoxelData, REFRESH_RATE); // Start fetching voxel data after the delay
//   }, DELAY_BEFORE_FETCH);
// })();
// ---- SIMULATION TIMELAPSE CODE ---- ///

const db = require("../config/db");
const redisClient = require("../config/redis");

let io;

const setSocketInstance = (socketIo) => {
  io = socketIo;
};

const getFeeds = async (req, res) => {
  try {
    // Check cache first
    const cachedFeeds =
      await redisClient.get("feeds");

    if (cachedFeeds) {
      return res.json({
        source: "redis-cache",
        data: JSON.parse(cachedFeeds),
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM feeds ORDER BY created_at DESC"
    );

    // Store in Redis
    await redisClient.setEx(
      "feeds",
      60,
      JSON.stringify(rows)
    );

    res.json({
      source: "mysql-db",
      data: rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const addFeed = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO feeds (title, description) VALUES (?, ?)",
      [title, description]
    );

    const newFeed = {
      id: result.insertId,
      title,
      description,
      created_at: new Date(),
    };

    // Clear Redis cache
    await redisClient.del("feeds");

    // Emit realtime event
    if (io) {
      io.emit("newFeed", newFeed);
    }

    res.status(201).json({
      message: "Feed added successfully",
      data: newFeed,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getFeeds,
  addFeed,
  setSocketInstance,
};
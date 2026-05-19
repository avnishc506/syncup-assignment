const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const feedRoutes = require("./routes/feedRoutes");
const initializeSocket = require("./socket/socket");
const {
  setSocketInstance,
} = require("./controllers/feedController");

const app = express();
const server = http.createServer(app);

const io = initializeSocket(server);
setSocketInstance(io);

app.use(cors());
app.use(express.json());

app.use("/api", feedRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
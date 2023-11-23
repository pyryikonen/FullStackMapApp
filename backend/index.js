const express = require("express");
const locationController = require("./routes/locationController.js");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

app.use(cors());

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
};

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

var connection = mysql.createConnection(config); // Use `connection` instead of `pool`
port = 8080;
let server = undefined;

app.use(limiter);
app.use(express.static("./frontend/dist"));
app.use(express.json());
app.use("/api/locations", locationController); // Use `locationController` instead of `router`

connection.connect((err) => {
  if (err) {
    console.log("MYSQL: Error connecting to database:", err);
    process.exit(1);
  } else {
    console.log("MYSQL: Connected to database.");
    server = app
      .listen(port, () => {
        console.log(`SERVER: Server listening on port ${port}`);
        console.log(process.env); // ADD THIS!!
      })
      .on("error", (err) => {
        console.error("SERVER: Error starting server:", err);
        process.exit(1);
      });
  }
});

const gracefulShutdown = () => {
  console.log("SERVER: Starting graceful shutdown...");

  // Close the server
  if (server) {
    console.log("SERVER: Server was opened, so we can close it...");
    server.close((err) => {
      if (err) {
        console.error("Error closing server:", err);
      } else {
        console.log("Server closed.");

        // Try to close the database connection
        connection.end((dbErr) => {
          if (dbErr) {
            console.error("Error closing MySQL connection:", dbErr);
          } else {
            console.log("MySQL connection closed.");
            process.exit(0); // Exit the process after successful shutdown
          }
        });
      }
    });
  } else {
    console.log("No server to close.");
    process.exit(0); // Exit the process if the server was not opened
  }
};

app.get("/your-endpoint", (req, res) => {
  const connectionId = generateConnectionId(); // Replace with your logic to generate a unique connection ID
  res.json({ connectionId });
});

function generateConnectionId() {
  // Replace this with your logic to generate a unique connection ID
  return Math.random().toString(36).substring(7);
}

// Define graceful shutdown listeners
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

module.exports = config;

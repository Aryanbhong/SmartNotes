const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/Db"); // Import Prisma client

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log("Database connected successfully");

    // Start Express server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();

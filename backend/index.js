// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const prisma = require("./config/Db"); 
// const path = require("path")
// dotenv.config();
// const app = express();

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json());

// const _dirname = path.resolve();

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/notes", require("./routes/noteRoutes"));

// const PORT = process.env.PORT || 5000;

// async function startServer() {
//   try {
   
//     await prisma.$connect();
//     console.log("Database connected successfully");

  
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   } catch (error) {
//     console.error("Database connection failed:", error.message);
//     process.exit(1);
//   }
// }

// app.use(express.static(path.join(_dirname, "/frontend/dist")))
// app.get(/^\/(?!api).*/,(req,res)=>{
//   res.sendFile(path.resolve(_dirname, "frontend", "dist","index.html"));
// })
// startServer();


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/Db");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smartnotes-1-v6ky.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Frontend build path: frontend is a sibling of backend
const frontendPath = path.resolve(__dirname, "../frontend/dist");

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));

// Serve React production build
app.use(express.static(frontendPath));

// Handle frontend routes without intercepting API requests
app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      console.error("Failed to serve frontend:", err.message);

      if (!res.headersSent) {
        res.status(500).send("Frontend build not found");
      }
    }
  });
});

// Start server after connecting to database
async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend path: ${frontendPath}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();

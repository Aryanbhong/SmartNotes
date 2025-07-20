const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/Db"); 
const path = require("path")
dotenv.config();
const app = express();

app.use(cors({ origin: "https://smartnotes-r3ac.onrender.com/", credentials: true }));
app.use(express.json());

const _dirname = path.resolve();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
   
    await prisma.$connect();
    console.log("Database connected successfully");

  
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get(/^\/(?!api).*/,(req,res)=>{
  res.sendFile(path.resolve(_dirname, "frontend", "dist","index.html"));
})
startServer();

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// -----------------------------
// ✅ MIDDLEWARE
// -----------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dsa-hub-livid.vercel.app",
      // your new vercel build
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// -----------------------------
// ✅ ROUTES
// -----------------------------
const userRoute = require("./routes/Auth");
const problemRoute = require("./routes/Problem");
const submitRoute = require("./routes/Submission");

app.use("/api/v1", userRoute);
app.use("/api/v1", problemRoute);
app.use("/api/v1", submitRoute);

// -----------------------------
// ✅ DB CONNECT → THEN START SERVER
// -----------------------------
connectDB()
  .then(() => {
    console.log(" Database Connected Successfully 🚀");

    app.listen(PORT, () => {
      console.log(` Server running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Database connection failed", err);
    process.exit(1);
  });

// -----------------------------
// OPTIONAL: ROOT ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.send("DSA Hub Backend is Running...");
});

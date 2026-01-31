import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { getRecommendations } from "./controllers/recommendations.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/activitydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API route
app.post("/api/recommendations", getRecommendations);

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));

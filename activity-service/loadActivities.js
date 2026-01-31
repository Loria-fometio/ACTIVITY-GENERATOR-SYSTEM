import mongoose from "mongoose";
import connectDB from "./db.js";
import Activity from "./models/Activity.js";
import fs from "fs";

connectDB();

const activities = JSON.parse(fs.readFileSync("activities.json", "utf-8"));

(async () => {
  try {
    await Activity.deleteMany({});
    await Activity.insertMany(activities);
    console.log("✅ Activities seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding activities:", err);
    process.exit(1);
  }
})();

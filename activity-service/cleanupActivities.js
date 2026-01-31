import mongoose from "mongoose";
import dotenv from "dotenv";
import Activity from "./models/Activity.js";

dotenv.config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Option 1: Drop the entire collection (fastest, removes everything)
    await Activity.collection.drop();
    console.log("🧹 Dropped activities collection completely");

    // Option 2 (alternative): Remove duplicates only
    // const all = await Activity.find({});
    // const seen = new Set();
    // for (const act of all) {
    //   const key = `${act.title}-${act.goal}-${act.preference}`;
    //   if (seen.has(key)) {
    //     await Activity.deleteOne({ _id: act._id });
    //     console.log(`Removed duplicate: ${act.title}`);
    //   } else {
    //     seen.add(key);
    //   }
    // }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error cleaning activities:", err);
  }
}

cleanup();

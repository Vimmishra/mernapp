import express from "express";
import Video from "../models/Video.js";



const router = express.Router();

router.get("/movies/:category", async (req, res) => {
  try {
    const categoryName = req.params.category;
    const videos = await Video.find({ category: categoryName });
    res.status(200).json({ data: videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category videos" });
  }
});

export default router;
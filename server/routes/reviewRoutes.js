

import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// Create new review
router.post("/", async (req, res) => {
  const { userId, movieId, rating, review } = req.body;
  try {
    const existing = await Review.findOne({ userId, movieId });
    if (existing) {
      // Optional: Update existing review instead of duplicate
      existing.rating = rating;
      existing.review = review;
      await existing.save();
      return res.status(200).json({ message: "Review updated", review: existing });
    }

    const newReview = new Review({ userId, movieId, rating, review });
    await newReview.save();

    res.status(201).json({ message: "Review created", review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all reviews for a movie with average rating
router.get("/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    const reviews = await Review.find({ movieId }).populate("userId", "name"); // populate user name
    const avgRating = reviews.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating: avgRating.toFixed(1) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
});

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['movie', 'series'], required: true },
  thumbnail: String,
  videoUrl: String, // for movie
  trailerUrl: String,
  episodes: [episodeSchema], // for series
  createdAt: { type: Date, default: Date.now },
  thumbnailUrl: String,
  category: String,
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
});

export default mongoose.model("Video", videoSchema);

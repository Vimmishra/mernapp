import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  dob: String,
  image: String,
});

export default mongoose.model("Actor", actorSchema);

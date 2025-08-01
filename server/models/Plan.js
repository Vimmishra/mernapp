import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: String,
  price: Number,
  durationInDays: Number, // e.g. 30 for 1 month
});

export default mongoose.model("Plan", planSchema);

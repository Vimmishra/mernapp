
/*
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },

     currentPlan: {
    name: String,
    expiresAt: Date,
  },
});

export default mongoose.model("User", userSchema);
*/


import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },


  likedCategories: {
      type: [String],
      default: [],
    },



    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    currentPlan: {
      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      purchaseDate: {
        type: Date,
      },
 expiryDate: {
        type: Date,
      },
      
    },  
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

// Method to check if user plan is active
userSchema.methods.isPlanActive = function () {
  return (
    this.currentPlan &&
    this.currentPlan.expiryDate &&
    this.currentPlan.expiryDate > new Date()
  );
};

export default mongoose.model("User", userSchema);

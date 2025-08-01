


import Plan from "../models/Plan.js";
import User from "../models/User.js";

// GET all available plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (err) {
    console.error("❌ Error fetching plans:", err);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

// POST: Capture payment and assign plan to user
export const capturePayment = async (req, res) => {
  try {
    console.log("📥 capturePayment called");
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);

    const { userId, planId } = req.body;

    if (!userId || !planId) {
      console.warn("⚠️ Missing userId or planId in request body");
      return res.status(400).json({ message: "Missing userId or planId" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      console.warn(`⚠️ Plan not found for planId: ${planId}`);
      return res.status(404).json({ message: "Plan not found" });
    }

    const purchaseDate = new Date();
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(purchaseDate.getDate() + plan.durationInDays);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        currentPlan: {
          planId,
          name: plan.name,
          price: plan.price,
          purchaseDate,
          expiryDate,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.warn(`⚠️ User not found for userId: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ Payment captured for user ${userId}, plan ${planId}`);
    res.status(200).json({
      success: true,
      message: "Payment captured and plan assigned successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error capturing payment:", err);
    res.status(500).json({ message: "Payment capture failed" });
  }
};




export const getUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.currentPlan) {
      return res.status(404).json({ message: "No current plan found for this user" });
    }

    console.log(" Sending current plan:", user.currentPlan); 
    res.status(200).json({ plan: user.currentPlan });
  } catch (err) {
    console.error("❌ Failed to get user plan:", err);
    res.status(500).json({ message: "Failed to get user plan" });
  }
};



//update if expired
export const updateUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndUpdate(userId);
    if (!user || !user.currentPlan) {
      return res.status(404).json({ message: "No current plan found for this user" });
    }

    console.log(" Sending current plan:", user.currentPlan); 
    res.status(200).json({ plan: user.currentPlan });
  } catch (err) {
    console.error("❌ Failed to get user plan:", err);
    res.status(500).json({ message: "Failed to get user plan" });
  }
};

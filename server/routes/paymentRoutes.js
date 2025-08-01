import express from "express";
import { getPlans, capturePayment, getUserPlan } from "../controller/paymentController.js";

const router = express.Router();

router.get("/plans", getPlans);
router.post("/capture-payment", capturePayment);

router.get("/user-plan/:userId", getUserPlan); 

export default router;

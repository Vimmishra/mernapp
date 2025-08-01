// routes/userRoutes.js
import express from "express";
import { addLikedCategory } from "../controller/userController.js";


const router = express.Router();

router.post("/add-liked-category", addLikedCategory);

export default router;


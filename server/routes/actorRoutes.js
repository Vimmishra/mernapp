import express from "express";
import { bulkAddActorsUsingGemini  } from "../controller/actorController.js";

const router = express.Router();

router.post("/bulk-gemini", bulkAddActorsUsingGemini);



export default router;



import express from "express";
import multer from "multer";
import {
  getAllMovies,
  getAllSeries,
  getHorrorMovies,
  getMovieDetails,
  getSeriesById,
  getSuperMovies,
  getThrillerMovies,
  updateSeries,
  uploadMovie,
  uploadSeries,
  getRecommendedMovies,
  getAllRecommendedMovies
} from "../controller/videoController.js";

const router = express.Router();

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route: Upload Movie with thumbnail
router.post(
  "/upload-movie",
  upload.fields([
    { name: "video", maxCount: 1 },
     { name: "trailer", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadMovie
);

// Route: Upload Series with episodes and thumbnail
router.post(
  "/upload-series",
  upload.fields([
    { name: "videos", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
    { name: "trailer", maxCount: 1 },
  ]),
  uploadSeries
);

// Route: Get all series
router.get("/series", getAllSeries);



//recommended:
// routes/movieRoutes.js
router.get("/recommended/:userId", getRecommendedMovies);

router.get("/Allrecommended/:userId", getAllRecommendedMovies);




// Route: Update series (add episodes, change title)
router.put(
  "/update-series/:id",
  upload.fields([
    { name: "videos", maxCount: 10 },
    { name: "trailer", maxCount: 1 },
  ]),
  updateSeries
);

// Route: Get all movies
router.get("/movies", getAllMovies);

router.get("/movies/:id", getMovieDetails);


router.get("/superMovies", getSuperMovies)
router.get("/thrillerMovies", getThrillerMovies)
router.get("/horrorMovies", getHorrorMovies)

router.get("/series/:id", getSeriesById);


export default router;

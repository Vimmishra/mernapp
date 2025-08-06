


import Video from "../models/Video.js";
import { uploadToCloudinary } from "../helpers/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Actor from "../models/Actor.js";
import User from "../models/User.js";





// ---------------- Upload Movie ----------------

//new actor vala:

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const uploadMovie = async (req, res) => {
  try {
    console.log(" Movie upload request received");
    console.log(" Body:", req.body);
    console.log("Files:", req.files);




    const { title, description, category, type = "movie", actors } = req.body;
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    const trailerFile = req.files?.trailer?.[0];

    if (!videoFile) {
      return res.status(400).json({ success: false, message: "Video file is required" });
    }

    //  Parse actor IDs (already created in frontend)
    let actorIds = [];
    try {
      actorIds = JSON.parse(actors); // Expecting: ["actorId1", "actorId2"]
    } catch (err) {
      console.warn(" Could not parse actor IDs");
    }

    // Upload video
    const videoResult = await uploadToCloudinary(videoFile.buffer, "videos", "video");
    let trailerUrl = "";
    if (trailerFile) {
      const trailerResult = await uploadToCloudinary(trailerFile.buffer, "trailers", "video");
      trailerUrl = trailerResult.secure_url;
    }
    let thumbnailUrl = "";
    if (thumbnailFile) {
      const thumbResult = await uploadToCloudinary(thumbnailFile.buffer, "thumbnails", "image");
      thumbnailUrl = thumbResult.secure_url;
    }

    const newMovie = await Video.create({
      title,
      description,
      category,
      type,
      videoUrl: videoResult.secure_url,
      trailerUrl,
      thumbnail: thumbnailUrl,
      actors: actorIds, //  Correct use of referenced IDs
    });

    console.log(" Movie saved to DB:", newMovie);
    res.status(201).json({ success: true, data: newMovie });

  } catch (err) {
    console.error(" Error uploading movie:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




// ---------------- Upload Series ----------------
// ---------------- Upload Series ----------------
export const uploadSeries = async (req, res) => {
  try {
    console.log("🎞 Series upload request received");

    const { title, description, freeEpisodeIndex, actors } = req.body;
    let episodeTitles = req.body.episodeTitles;
    const videoFiles = req.files?.videos || [];
    const thumbnailFile = req.files?.thumbnail?.[0];
    const trailerFile = req.files?.trailer?.[0];

    if (!videoFiles.length || !thumbnailFile) {
      return res.status(400).json({ success: false, message: "Videos and thumbnail are required" });
    }




    let actorIds = [];
    try {
      actorIds = JSON.parse(actors); // Expecting: ["actorId1", "actorId2"]
    } catch (err) {
      console.warn(" Could not parse actor IDs");
    }




    // Upload thumbnail as image
    const thumbResult = await uploadToCloudinary(
      thumbnailFile.buffer,
      "series/thumbnails",
      "image"
    );
    const thumbnailUrl = thumbResult.secure_url;
    console.log("Thumbnail uploaded");

    //  Normalize episode titles
    const titles = Array.isArray(episodeTitles) ? episodeTitles : [episodeTitles];
    if (titles.length !== videoFiles.length) {
      return res.status(400).json({
        success: false,
        message: "Episode titles count must match number of uploaded videos",
      });
    }

    //  Upload all episode videos
    const episodes = await Promise.all(
      videoFiles.map(async (file, index) => {
        console.log(`📤 Uploading Episode ${index + 1}: ${titles[index]}`);
        const result = await uploadToCloudinary(file.buffer, "series/episodes", "video");
        return {
          title: titles[index],
          videoUrl: result.secure_url,
          isFree: parseInt(freeEpisodeIndex) === index,
        };
      })
    );

    //  Upload trailer (optional)
    let trailerUrl = "";
    if (trailerFile) {
      const trailerResult = await uploadToCloudinary(
        trailerFile.buffer,
        "series/trailers",
        "video"
      );
      trailerUrl = trailerResult.secure_url;
      console.log("🎞️ Trailer uploaded");
    }

    //  Save to DB
    const newSeries = await Video.create({
      title,
      description,
      actor: actorIds,
      type: "series",
      episodes,
      trailerUrl,
      thumbnail: thumbnailUrl,
    });

    console.log("✅ Series uploaded successfully");
    res.status(201).json({ success: true, data: newSeries });

  } catch (err) {
    console.error("❌ Error uploading series:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Internal server error during series upload"
    });
  }
};






// ---------------- Get All Movies ----------------
export const getAllMovies = async (req, res) => {
  try {
    const moviesList = await Video.find({ type: "movie" })
    .sort({createdAt: -1})
    ;
    res.status(200).json({
      success: true,
      message: "List of all movies fetched",
      data: moviesList
    });
  } catch (err) {
    console.log("❌ Internal server error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




//new moviedetails with actors:
export const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Populate the 'actors' field to get full actor documents instead of just IDs
    const movieDetails = await Video.findById(id)
      .populate("actors")
      .lean();  // optional: use lean() for plain JS object instead of mongoose doc

    if (!movieDetails) {
      return res.status(404).json({
        success: false,
        message: "No movie details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: movieDetails,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};






// ---------------- Get All Series ----------------
export const getAllSeries = async (req, res) => {
  try {
    const seriesList = await Video.find({ type: "series" }).sort({createdAt:-1});
    res.status(200).json({ success: true, data: seriesList });
  } catch (err) {
    console.error("❌ Error fetching series:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- Update Series ----------------
export const updateSeries = async (req, res) => {
  try {
    const { title } = req.body;
    const newFiles = req.files?.videos;

    const series = await Video.findById(req.params.id);
    if (!series) return res.status(404).json({ success: false, message: "Series not found" });

    if (title) series.title = title;

    if (newFiles?.length) {
      const newEpisodes = await Promise.all(
        newFiles.map(async (file, i) => {
          const result = await uploadToCloudinary(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`);
          return {
            title: `New Episode ${series.episodes.length + i + 1}`,
            videoUrl: result.secure_url,
            isFree: false,
          };
        })
      );
      series.episodes.push(...newEpisodes);
    }

    await series.save();
    res.status(200).json({ success: true, data: series });
  } catch (err) {
    console.error("❌ Error updating series:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getSeriesById = async (req, res) => {
  try {
    const series = await Video.findById(req.params.id);
    if (!series || series.type !== "series") {
      return res.status(404).json({ success: false, message: "Series not found" });
    }
    res.status(200).json({ success: true, data: series });
  } catch (err) {
    console.error("❌ Error fetching series by ID:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


//category wise movies fetch
//superhero
export const getSuperMovies = async (req, res) => {
  try {
    const superMovie = await Video.find({
      type: "movie",
      category: "superhero"
    });

    res.status(200).json({
      success: true, // also fixed spelling
      message: "All superhero movies fetched!",
      data: superMovie
    });
  } catch (err) {
    console.error("Error fetching superhero movies:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch superhero movies",
      error: err.message
    });
  }
};


//thriller
export const getThrillerMovies = async (req, res) => {
  try {
    const thrillerMovie = await Video.find({
      type: "movie",
      category: "thriller"
    });

    res.status(200).json({
      success: true, // also fixed spelling
      message: "All thriller movies fetched!",
      data: thrillerMovie
    });
  } catch (err) {
    console.error("Error fetching thriller movies:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch thriller movies",
      error: err.message
    });
  }
};




//horror
export const getHorrorMovies = async (req, res) => {
  try {
    const horrorMovie = await Video.find({
      type: "movie",
      category: "horror"
    });

    res.status(200).json({
      success: true, // also fixed spelling
      message: "All horror movies fetched!",
      data: horrorMovie
    });
  } catch (err) {
    console.error("Error fetching horror movies:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch horror movies",
      error: err.message
    });
  }
};





// controllers/movieController.js


export const getRecommendedMovies = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const likedCategories = user.likedCategories || [];

    let recommended = [];

    // For each liked category, get up to 3 movies
    for (const category of likedCategories) {
      const movies = await Video.find({ category })
  .sort({ createdAt: -1 }) // 👈 sort by latest
  .limit(2);
      recommended = recommended.concat(movies);
    }

    res.json(recommended);
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
    res.status(500).json({ message: "Failed to fetch recommended movies", error });
  }
};




export const getAllRecommendedMovies = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const likedCategories = user.likedCategories || [];

    let recommended = [];

    // For each liked category, get up to 3 movies
    for (const category of likedCategories) {
      const movies = await Video.find({ category })
  .sort({ createdAt: -1 }) // 👈 sort by latest
 
      recommended = recommended.concat(movies);
    }

    res.json(recommended);
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
    res.status(500).json({ message: "Failed to fetch recommended movies", error });
  }
};


import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/movie-news", async (req, res) => {
  try {
    const response = await axios.get("http://api.mediastack.com/v1/news", {
      params: {
        access_key: "c4b024d37dac78e7105c7b79387b5a72",
        keywords: "movies",
        languages: "en",
        sort: "published_desc",
        limit: 10,
      },
    });

    res.status(200).json({ success: true, data: response.data.data });
  } catch (error) {
    console.error("Error fetching movie news:", error);
    res.status(500).json({ success: false, message: "Failed to fetch news" });
  }
});

export default router;

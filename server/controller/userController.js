// controllers/userController.js
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addLikedCategory = async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    console.log("Received userId:", userId);
    console.log("Received movieId:", movieId);

    if (!userId || !movieId) {
      return res.status(400).json({ message: "userId and movieId are required" });
    }

    const user = await User.findById(userId);
    const movie = await Video.findById(movieId);

    console.log("Fetched user:", user);
    console.log("Fetched movie:", movie);

    if (!user || !movie) {
      return res.status(404).json({ message: "User or movie not found" });
    }

    const category = movie.category;
    console.log("Movie category:", category);

    if (!category) {
      return res.status(400).json({ message: "Movie has no category" });
    }

    if (!user.likedCategories.includes(category)) {
      user.likedCategories.push(category);

if(user.likedCategories.length > 5){
  user.likedCategories.shift()
}

      await user.save();
      console.log("Category added to user successfully.");
    } else {
      console.log("Category already exists in user.");
    }

    return res.json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Error in addLikedCategory:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};


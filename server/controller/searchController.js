import Video from '../models/Video.js';

export const searchMovies = async (req, res) => {
    try {
        const { keyword } = req.params;

        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({
                success: false,
                message: "Keyword must be a string",
            });
        }

        const regEx = new RegExp(keyword, "i");

        const createSearchQuery = {
            $or: [
                { title: regEx },
                { type: regEx },
            ],
        };

        const searchResults = await Video.find(createSearchQuery);

        res.status(200).json({
            success: true,
            data: searchResults,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Could not find course!",
        });
    }
};
 
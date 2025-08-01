
import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();
  const {user} = useAuth();

  // ✅ Get userId from localStorage (or your auth context)
  const userId = user.id

  const fetchMovies = useCallback(async () => {
    try {
      console.log("Fetching movies...");
      const res = await axiosInstance.get("/api/videos/movies");
      console.log("Movies fetched:", res.data.data);
      setMovies(res.data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, []);

  const fetchReviewRatings = useCallback(async (movieId) => {
    try {
      const res = await axiosInstance.get(`/api/reviews/${movieId}`);
      const avg = Number(res.data.avgRating) || 0;
      setRatings((prev) => ({ ...prev, [movieId]: avg.toFixed(1) }));
      console.log(`Avg rating for ${movieId}: ${avg.toFixed(1)}`);
    } catch (err) {
      console.error(`Error fetching review for ${movieId}:`, err);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    movies.forEach((movie) => {
      fetchReviewRatings(movie._id);
    });
  }, [movies, fetchReviewRatings]);

  const handleMovieClick = async (movie) => {
    if (!userId) {
      console.warn("Register with us!. Redirecting to login...");
      navigate("/login");
      return;
    }

    try {
      console.log("Sending to backend:", {
        userId,
        movieId: movie._id,
        category: movie.category,
      });

      await axiosInstance.post("/users/add-liked-category", {
        userId,
        movieId: movie._id,
      });

      console.log("Category sent successfully. Navigating to movie page...");
      navigate(`/movie/${movie._id}`);
    } catch (error) {
      console.error("Failed to add liked category:", error);
      navigate(`/movie/${movie._id}`); // fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white px-4 py-8">
      <h2 className="text-4xl font-extrabold mb-8 text-center">Browse Movies</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="group bg-[#1f1f1f] rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 hover:z-10 cursor-pointer"
            onClick={() => handleMovieClick(movie)}
          >
            <div className="relative">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{movie.description}</p>

              <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {ratings[movie._id] || 'N/A'}
                </span>
                <span className="uppercase text-xs">{movie.genre || movie.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMovies;

import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RecommendedMoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const fetchRecommendedMovies = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/api/videos/Allrecommended/${userId}`);
      setMovies(res.data);
    } catch (error) {
      console.error("Error fetching recommended movies:", error);
    }
  }, [userId]);

  const fetchReviewRatings = useCallback(async (movieId) => {
    try {
      const res = await axiosInstance.get(`/api/reviews/${movieId}`);
      const avg = Number(res.data.avgRating) || 0;
      setRatings((prev) => ({ ...prev, [movieId]: avg.toFixed(1) }));
    } catch (err) {
      console.error(`Error fetching review for ${movieId}:`, err);
    }
  }, []);

  useEffect(() => {
    if (userId) fetchRecommendedMovies();
  }, [fetchRecommendedMovies]);

  useEffect(() => {
    movies.forEach((movie) => {
      fetchReviewRatings(movie._id);
    });
  }, [movies, fetchReviewRatings]);

  const handleMovieClick = async (movie) => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      await axiosInstance.post("/users/add-liked-category", {
        userId,
        movieId: movie._id,
      });

      navigate(`/movie/${movie._id}`);
    } catch (error) {
      console.error("Failed to add liked category:", error);
      navigate(`/movie/${movie._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white px-4 py-8">
      <h2 className="text-4xl font-extrabold mb-8 text-center">
        Recommended For You
      </h2>

      {movies.length === 0 ? (
        <p className="text-center text-gray-400">No recommendations found.</p>
      ) : (
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
                <p className="text-sm text-gray-400 line-clamp-2">
                  {movie.description}
                </p>

                <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {ratings[movie._id] || 'N/A'}
                  </span>
                  <span className="uppercase text-xs">
                    {movie.genre || movie.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedMoviesList;

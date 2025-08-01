// components/RecommendedMovies.jsx
/*


import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Link } from "react-router-dom";

const RecommendedMovies = ({ userId }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axiosInstance.get(`/api/videos/recommended/${userId}`);
        setMovies(res.data);
      } catch (error) {
        console.error("Error fetching recommended movies", error);
      }
    };
    fetchRecommended();
  }, [userId]);

  if (!movies.length) return <p>No recommendations yet</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <Link key={movie._id} to={`/movie/${movie._id}`}>
            <div className="rounded shadow hover:scale-105 transition">
              <img src={movie.thumbnail} alt={movie.title} className="w-full h-60 object-cover rounded" />
              <p className="text-center mt-2">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedMovies;
*/


import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const RecommendedMovies = ({ userId }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axiosInstance.get(`/api/videos/recommended/${userId}`);
        setMovies(res.data || []);
      } catch (error) {
        console.error("Error fetching recommended movies:", error);
      }
    };
    fetchRecommended();
  }, [userId]);

  const displayedMovies = movies.slice(0, 12);

  if (!movies.length) return <p className="px-4 text-white">No recommendations yet</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6 text-white">Recommended for You</h2>

      <div className="flex overflow-x-auto space-x-6 scrollbar-hide px-1">
        {displayedMovies.map((movie) => (
          <Link to={`/movie/${movie._id}`} key={movie._id} className="flex-shrink-0 w-[250px]">
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 hover:scale-105">
              {movie.thumbnail ? (
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-60 object-cover object-center"
                />
              ) : (
                <div className="w-full h-60 flex items-center justify-center bg-gray-700 text-white">
                  No Thumbnail
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{movie.description}</p>
                <p className="text-xs text-gray-500 mt-2">Category: {movie.category}</p>
              </div>
            </div>
          </Link>
        ))}

        {/* View More Card */}
        <div
          onClick={() => navigate("/recommended-movies")}
          className="flex-shrink-0 w-[250px] cursor-pointer"
        >
          <div className="h-full bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl flex flex-col justify-center items-center text-white shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white animate-pulse mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg font-semibold">View More</span>
            <span className="text-sm text-gray-400 mt-1">Explore all recommended</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedMovies;

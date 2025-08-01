import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";

const ViewMorePage = () => {
  const { category } = useParams();
  const [movies, setMovies] = useState([]);

  const fetchCategoryMovies = async () => {
    try {
      const res = await axiosInstance.get(`/all-movies/movies/${category}`);
      setMovies(res.data.data || []);
    } catch (err) {
      console.error("Error loading movies", err);
    }
  };

  useEffect(() => {
    fetchCategoryMovies();
  }, [category]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">View More: {category} Movies</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link to={`/movie/${movie._id}`} key={movie._id}>
            <div className="bg-zinc-900 rounded-lg overflow-hidden shadow hover:scale-105 transition">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-3 text-white">
                <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {movie.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ViewMorePage;

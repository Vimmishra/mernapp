import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Cake, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axiosInstance.get(`/api/videos/movies/${id}`);
        setMovie(res.data.data);
        console.log(res)
      } catch (error) {
        console.error("❌ Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const checkUserPlan = async () => {
      if (!user?.id) return;

      try {
        const res = await axiosInstance.get(`/api/payment/user-plan/${user.id}`);
        const plan = res.data?.plan;

        if (plan && plan.expiryDate) {
          const expiry = new Date(plan.expiryDate);
          const now = new Date();
          setHasActivePlan(expiry > now);
        }
      } catch (err) {
        console.warn("⚠️ Could not fetch user plan:", err);
      }
    };

    checkUserPlan();
  }, [user]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const res = await axiosInstance.get(`/api/reviews/${id}`);
      setReviews(res.data.reviews || []);
      setAvgRating(Number(res.data.avgRating) || 0);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoadingReviews(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader className="animate-spin mr-2" /> Loading movie...
      </div>
    );
  }

  if (!movie) {
    return <div className="text-white text-center mt-10">Movie not found.</div>;
  }

  const videoToShow = hasActivePlan ? movie.videoUrl : movie.trailerUrl;

  return (
    <div className="min-h-screen bg-black text-white ">
      {/* Hero Section */}
      <div className="relative w-full h-[80vh]">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover brightness-50 z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{movie.title}</h1>
          <p className="max-w-2xl text-gray-300 mb-6">{movie.description}</p>

          {videoToShow && (
            <div className="w-full max-w-3xl">
              <video
                controls
                className="rounded-md shadow-xl w-full border border-gray-700"
                src={videoToShow}
              />
              {!hasActivePlan && (
                
                <p className="text-yellow-300 mt-2">
                  🔒 This is a trailer. Purchase a plan to watch the full movie.
                </p>
                
                
              )}
            </div>
          )}

          <div>

             {!hasActivePlan && (
              <div>
                <h1>You did not have any active plan buy plan to watch full movie</h1>
                <Button onClick={()=>navigate("/plans")}>See Plans</Button>
              </div>
             )}
          </div>


        </div>
      </div>

      {/* Rest Content */}
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <p><span className="font-semibold">Category:</span> {movie.category}</p>
        <p><span className="font-semibold">Type:</span> {movie.type}</p>

        {/* Average Rating */}
        <div className="flex items-center gap-3 mt-4">
          <p className="font-semibold text-lg">Average Rating:</p>
          <div className="flex text-yellow-400 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={avgRating >= star ? "text-yellow-400" : "text-gray-600"}>★</span>
            ))}
          </div>
          <span className="text-white text-lg ml-2">({avgRating.toFixed(1)})</span>
        </div>










<div className="mt-8 border-t border-gray-700 pt-6">
  
      {/* 🎭 Full Actor Cards */}
      {movie.actors && movie.actors.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Actors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {movie.actors.map((actor) => (
              <div
                key={actor._id}
                className="bg-zinc-900 border border-zinc-700 p-4 rounded-md shadow hover:shadow-lg transition"
              >
              
                <h3 className="text-lg font-semibold">{actor.name}</h3>
                {actor.dob && (
                  <p className="text-gray-400 text-sm mb-1 flex gap-1">
                    <Cake className="h-4 w-4"/> {new Date(actor.dob).toLocaleDateString()}
                  </p>
                )}
                <p className="text-gray-300 text-sm">{actor.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 👥 Cast Section (Bottom Summary) */}
      {movie.actors && movie.actors.length > 0 && (
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">Cast:</h2>
          <div className="flex flex-wrap gap-5">
            {movie.actors.map((actor) => (
              <div key={actor._id} className="flex items-center gap-2">
              
                <span className="text-sm text-white">{actor.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

</div>












        {/* Submit Review */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
          <div className="flex gap-2 text-yellow-400 text-2xl mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer transition ${
                  (hoverRating || rating) >= star ? "text-yellow-400 scale-110" : "text-gray-600"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>

          <Input
            type="text"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="text-white bg-zinc-800 border border-gray-600 focus:border-pink-500"
          />

          <button
            onClick={async () => {
              if (!rating || !review.trim()) {
                alert("Please give a rating and review.");
                return;
              }

              try {
                await axiosInstance.post("/api/reviews", {
                  userId: user.id,
                  movieId: movie._id,
                  rating,
                  review,
                });
                alert("Review submitted!");
                setRating(0);
                setReview("");
                fetchReviews();
              } catch (error) {
                console.error("Error submitting review:", error);
                alert("Something went wrong!");
              }
            }}
            className="mt-4 bg-pink-600 px-5 py-2 rounded-md text-white hover:bg-pink-700 transition"
          >
            Submit Review
          </button>
        </div>

        {/* Review List */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
          {loadingReviews ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet.</p>
          ) : (
            <ul className="space-y-6">
              {reviews.map(({ _id, userId, rating, review, createdAt }) => (
                <li
                  key={_id}
                  className="bg-zinc-900 border border-zinc-700 p-4 rounded-md shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{userId?.name || "Anonymous"}</span>
                    <div className="text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={rating >= star ? "text-yellow-400" : "text-gray-600"}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{review}</p>
                  <small className="text-gray-500">
                    {new Date(createdAt).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

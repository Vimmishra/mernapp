import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/api/axiosInstance";

const SeriesDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [series, setSeries] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);


const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);





  // Fetch series
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axiosInstance.get(`/api/videos/series/${id}`);
        const seriesData = res.data.data;
        setSeries(seriesData);

        // Auto-select free or first episode
        if (seriesData.episodes.length > 0) {
          const defaultEpisode = seriesData.episodes.find(ep => ep.isFree) || seriesData.episodes[0];
          setSelectedEpisode(defaultEpisode);
        }
      } catch (err) {
        console.error("Error fetching series:", err);
      }
    };

    fetchSeries();
  }, [id]);

  // Check user plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user?.id) return;

      try {
        const res = await axiosInstance.get(`/api/payment/user-plan/${user.id}`);
        const { plan } = res.data;
        const now = new Date();
        const expiry = new Date(plan?.expiryDate);
        setHasActivePlan(plan && now < expiry);
      } catch (err) {
        console.error("Error fetching user plan:", err);
        setHasActivePlan(false);
      }
    };

    fetchUserPlan();
  }, [user]);





//review
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









  if (!series) return <p className="text-center py-10 text-gray-500">Loading series...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
     

      {/* Episodes and Player */}
      {hasActivePlan ? (
        <>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              📺 Episodes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {series.episodes.map((ep, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedEpisode(ep)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedEpisode?.title === ep.title
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-1">{ep.title}</h3>
                  {ep.isFree && (
                    <span className="inline-block text-green-600 text-sm font-medium">
                      Free Episode
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedEpisode && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                🎞 Now Playing: <span className="text-blue-600">{selectedEpisode.title}</span>
              </h2>
              <video
                src={selectedEpisode.videoUrl}
                controls
                className="w-full max-h-[500px] rounded-xl shadow-lg"
              />
            </div>
          )}
        </>
      ) : (

        <div>

 <h1 className="text-4xl font-bold mb-2 text-center">{series.title}</h1>
      <p className="mb-6 text-gray-600 text-center max-w-3xl mx-auto">{series.description}</p>

      {/* Trailer */}
      {series.trailerUrl && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            🎬 Trailer
          </h2>
          <video
            src={series.trailerUrl}
            controls
            className="w-full max-h-[450px] rounded-lg shadow-md"
          />
        </div>
      )}

        <div className="mt-8 text-center">
          <p className="text-red-500 font-semibold text-lg">
            🔒 Unlock all episodes by purchasing a subscription plan.
          </p>
        </div>
        </div>
      )}






 <div className="flex items-center gap-3 mt-4">
          <p className="font-semibold text-lg">Average Rating:</p>
          <div className="flex text-yellow-400 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={avgRating >= star ? "text-yellow-400" : "text-gray-600"}>★</span>
            ))}
          </div>
          <span className="text-white text-lg ml-2">({avgRating.toFixed(1)})</span>
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
                  movieId: series._id,
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
  );
};

export default SeriesDetails;

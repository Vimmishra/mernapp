


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeftIcon, Copy, PackageX, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [selectedMovieUrl, setSelectedMovieUrl] = useState("");
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createdRoomId, setCreatedRoomId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get("/api/videos/movies");
        setMovies(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch movies:", err);
      }
    };

    const fetchUserPlan = async () => {
      try {
        if (!user?.id) return;
        const res = await axiosInstance.get(
          `/api/payment/user-plan/${user.id}`
        );
        const data = res.data;
        if (data.plan && data.plan.name && new Date(data.plan.expiryDate) > new Date()) {
          setUserPlan(data.plan);
        } else {
          setUserPlan(null);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user plan:", err);
        setUserPlan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    fetchUserPlan();
  }, [user]);

  const handleCreate = () => {
    if (!selectedMovieUrl) {
      alert("Please select a movie before creating a room.");
      return;
    }
    const roomId = uuid();
    setCreatedRoomId(roomId);
  };

  const handleCopy = () => {
    if (createdRoomId) {
      navigator.clipboard.writeText(createdRoomId);
    }
  };

  const handleDialogClose = () => {
    if (createdRoomId) {
      navigate(`/watch/${createdRoomId}?movieUrl=${encodeURIComponent(selectedMovieUrl)}`);
    }
  };

  const showLockedDialog = !loading && !userPlan;

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 relative bg-zinc-900 text-white px-4">
      <h1 className="text-3xl font-bold">🎬 Create Watch Party</h1>

      <input
        className="border p-2 w-64 rounded bg-zinc-800 text-white"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter Room Name"
        disabled={showLockedDialog}
      />

      <input
        className="border p-2 w-64 rounded bg-zinc-800 text-white"
        type="text"
        placeholder="Search movie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={showLockedDialog}
      />

      {/* Movie List */}
      <div className="border p-2 w-64 rounded bg-white max-h-64 overflow-y-auto text-black">
        {filteredMovies.length === 0 ? (
          <div className="text-sm text-center py-2 text-gray-500">No movies found.</div>
        ) : (
          filteredMovies.map((movie) => (
            <div
              key={movie._id}
              className={`flex items-center justify-between p-2 mb-1 rounded-lg transition-all cursor-pointer hover:bg-zinc-200 ${
                selectedMovieUrl === movie.videoUrl ? "bg-green-100" : ""
              }`}
              onClick={() => setSelectedMovieUrl(movie.videoUrl)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium truncate">{movie.title}</span>
              </div>

              {selectedMovieUrl === movie.videoUrl && (
                <CheckCircle className="text-green-500 w-5 h-5" />
              )}
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleCreate}
        disabled={showLockedDialog}
        className={`px-6 py-2 rounded text-white ${
          showLockedDialog
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 transition"
        }`}
      >
        Create Room
      </button>

      {/* Locked Subscription Dialog */}
      {showLockedDialog && (
        <Dialog open={true}>
          <DialogContent className="bg-zinc-900 text-white border border-red-500 rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-500 text-lg">
                <PackageX className="w-5 h-5" />
                Subscription Required
              </DialogTitle>
            </DialogHeader>
            <div className="text-center mt-4 text-sm">
              <p>You do not have any active subscription.</p>
              <p className="mt-2 font-semibold text-yellow-400">
                Buy a plan to access this feature.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Back to home
                </button>
                <button
                  onClick={() => navigate("/plans")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Go to Plans
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Room Created Dialog */}
      {createdRoomId && (
        <Dialog open={true} onOpenChange={handleDialogClose}>
          <DialogContent className="bg-zinc-900 text-white rounded-xl shadow-2xl border border-green-600 max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-green-400 text-xl text-center">
                ✅ Room Created!
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 text-center">
              <p className="mb-2 text-sm text-zinc-300">Share this Room ID with others:</p>
              <div className="flex items-center justify-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-600">
                <span className="font-mono text-lg">{createdRoomId}</span>
                <button onClick={handleCopy}>
                  <Copy className="w-5 h-5 text-white hover:text-green-400" />
                </button>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                You will be redirected to the room once you close this dialog.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CreateRoom;

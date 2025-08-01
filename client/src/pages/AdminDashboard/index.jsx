import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import VideoPlayer from "@/components/video-player";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { LogOut, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminSeriesDashboard = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [moviesList, setMoviesList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [newEpisodes, setNewEpisodes] = useState([]);
  const [tab, setTab] = useState("series");

   const { user, logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [seriesRes, moviesRes] = await Promise.all([
      axiosInstance.get("/api/videos/series"),
      axiosInstance.get("/api/videos/movies"),
    ]);
    setSeriesList(seriesRes.data.data);
    setMoviesList(moviesRes.data.data);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    const formData = new FormData();
    formData.append("title", title);
    newEpisodes.forEach((ep) => {
      formData.append("episodeTitles", ep.title);
      formData.append("videos", ep.file);
    });
    try {
      await axiosInstance.put(`/api/videos/update-series/${selected._id}`, formData);
      alert("✅ Series updated successfully!");
      setSelected(null);
      setTitle("");
      setNewEpisodes([]);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Error updating series");
    }
  };

  const handleEpisodeChange = (index, field, value) => {
    const updated = [...newEpisodes];
    updated[index] = { ...updated[index], [field]: value };
    setNewEpisodes(updated);
  };

  const addNewEpisodeField = () => {
    setNewEpisodes([...newEpisodes, { title: "", file: null }]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* Header & Upload Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">🎥 Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link
            to="/uploadseries"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow transition"
          >
            + Upload Series
          </Link>
          <Link
            to="/uploadmovie"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded shadow transition"
          >
            + Upload Movie
          </Link>

<button
                onClick={logout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

        </div>
      </div>

      {/* Tabs for View Switching */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`px-4 py-2 font-semibold ${
            tab === "series"
              ? "border-b-2 border-red-600 text-red-600"
              : "text-gray-500 hover:text-red-500"
          }`}
          onClick={() => setTab("series")}
        >
          Series
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            tab === "movies"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-purple-500"
          }`}
          onClick={() => setTab("movies")}
        >
          Movies
        </button>
      </div>

      {/* === Series Tab === */}
      {tab === "series" && (
        <>
          <h2 className="text-2xl font-semibold mb-4">📺 Uploaded Series</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seriesList.map((s) => (
              <Dialog key={s._id}>
                <DialogTrigger asChild>
                  <div
                    className="relative border rounded-xl p-4 shadow-md hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => {
                      setSelected(s);
                      setTitle(s.title);
                      setNewEpisodes([]);
                    }}
                  >
                    <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                      <Pencil className="w-4 h-4 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <p className="text-sm text-gray-600">
                      {s.episodes.length} episode(s)
                    </p>
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Edit Series - {selected?.title}</DialogTitle>
                    <DialogDescription>
                      You can update the title and add new episodes.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <input
                      className="border rounded px-4 py-2 w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Update Series Title"
                    />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">➕ Add New Episodes</h4>
                      {newEpisodes.map((ep, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row items-center gap-2"
                        >
                          <input
                            type="text"
                            placeholder={`Episode ${idx + 1} Title`}
                            value={ep.title}
                            onChange={(e) =>
                              handleEpisodeChange(idx, "title", e.target.value)
                            }
                            className="border rounded px-3 py-2 w-full"
                          />
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              handleEpisodeChange(idx, "file", e.target.files[0])
                            }
                            className="w-full sm:w-auto"
                          />
                        </div>
                      ))}

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                        onClick={addNewEpisodeField}
                      >
                        + Add Episode
                      </button>
                    </div>
                  </div>

                  <DialogFooter>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
                      onClick={handleUpdate}
                    >
                      💾 Save Changes
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </>
      )}

      {/* === Movies Tab === */}
      {tab === "movies" && (
        <>
          <h2 className="text-2xl font-semibold mb-4">🎬 Uploaded Movies</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moviesList.map((m) => (
              <div
                key={m._id}
                className="border rounded-lg overflow-hidden shadow-md bg-white"
              >
                <img
                  src={m.thumbnail}
                  alt={m.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <VideoPlayer
                    className="rounded"
                    width="100%"
                    height="300px"
                    url={m.videoUrl}
                    title={m.title}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSeriesDashboard;


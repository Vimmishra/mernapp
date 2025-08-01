
import { useState } from "react";
import axios from "axios";
import {
  Video,
  ImageIcon,
  Film,
  UploadCloud,
  Clapperboard,
  Loader2,
  Type,
  FolderInput,
} from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

export default function UploadMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [category, setCategory] = useState("");
  const [actorNames, setActorNames] = useState(""); // ⬅️ New: Textarea value
  const [loading, setLoading] = useState(false);

const handleUpload = async () => {
  if (!title || !description || !video || !thumbnail) {
    alert("Please fill all fields and select both video and thumbnail.");
    return;
  }

  try {
    setLoading(true);

    // Process actor names via Gemini
    const actorNameList = actorNames
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);

    console.log("📤 Sending actor names to bulk Gemini:", actorNameList);

    let actorIds = [];
    if (actorNameList.length > 0) {
      const actorRes = await axiosInstance.post(
        "/actors/bulk-gemini",
        { names: actorNameList }
      );
      console.log("📥 Response from bulk Gemini:", actorRes.data);

      if (actorRes.data && Array.isArray(actorRes.data.actorIds)) {
        actorIds = actorRes.data.actorIds;
      } else {
        console.warn("⚠️ Invalid actorIds response");
      }
    } else {
      console.log("⚠️ No actor names entered");
    }

    console.log("📤 Sending movie upload with the following fields:");
    console.log({ title, description, video, trailer, thumbnail, category, actors: actorIds });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);
    formData.append("trailer", trailer);
    formData.append("thumbnail", thumbnail);
    formData.append("category", category);
    formData.append("actors", JSON.stringify(actorIds)); // sending actor IDs here

    const res = await axiosInstance.post(
      "/api/videos/upload-movie",
      formData
    );

    alert("✅ Movie uploaded successfully!");
    console.log(res.data);

    // Reset form
    setTitle("");
    setDescription("");
    setVideo(null);
    setTrailer(null);
    setThumbnail(null);
    setCategory("");
    setActorNames("");
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    alert("Error uploading movie");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <Film className="text-blue-600" /> Upload Movie
        </h2>

        {/* Title */}
        <div className="relative">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            <Type className="inline-block mr-1" /> Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter movie title"
            className="w-full border border-gray-300 rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Clapperboard className="absolute left-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            <FolderInput className="inline-block mr-1" /> Category
          </label>
          <select
            id="category"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="superhero">Superhero</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="thriller">Thriller</option>
            <option value="horror">Horror</option>
            <option value="sci-fi">Sci-Fi</option>
          </select>
        </div>

        {/* Actors */}
        <div>
          <label htmlFor="actors" className="block text-sm font-medium mb-1">
            🎭 Actor Names (one per line)
          </label>
          <textarea
            id="actors"
            placeholder="e.g.\nTom Holland\nZendaya"
            className="w-full border border-gray-300 rounded-md p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={actorNames}
            onChange={(e) => setActorNames(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            📝 Description
          </label>
          <textarea
            id="description"
            placeholder="Enter movie description"
            className="w-full border border-gray-300 rounded-md p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Video Upload */}
        <div>
          <label htmlFor="video-upload" className="text-sm font-medium mb-1 cursor-pointer flex items-center gap-2 text-gray-700">
            <UploadCloud className="w-5 h-5" /> Main Movie File
          </label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full"
          />
          {video && <p className="mt-1 text-sm text-green-600 truncate">{video.name}</p>}
        </div>

        {/* Trailer Upload */}
        <div>
          <label htmlFor="trailer-upload" className="text-sm font-medium mb-1 cursor-pointer flex items-center gap-2 text-gray-700">
            <Video className="w-5 h-5" /> Trailer (Optional)
          </label>
          <input
            id="trailer-upload"
            type="file"
            accept="video/*"
            onChange={(e) => setTrailer(e.target.files[0])}
            className="w-full"
          />
          {trailer && <p className="mt-1 text-sm text-green-600 truncate">{trailer.name}</p>}
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label htmlFor="thumbnail-upload" className="text-sm font-medium mb-1 cursor-pointer flex items-center gap-2 text-gray-700">
            <ImageIcon className="w-5 h-5" /> Thumbnail Image
          </label>
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full"
          />
          {thumbnail && <p className="mt-1 text-sm text-green-600 truncate">{thumbnail.name}</p>}
        </div>

        {/* Submit */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" /> Upload Movie
            </>
          )}
        </button>
      </div>
    </div>
  );
}

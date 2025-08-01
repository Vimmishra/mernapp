import React, { useState } from "react";
import axios from "axios";
import { ImageIcon, Video, Plus, Upload, Film } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

const UploadSeries = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [episodes, setEpisodes] = useState([{ title: "", file: null }]);
  const [freeEpisodeIndex, setFreeEpisodeIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload % progress
  const [isUploading, setIsUploading] = useState(false);   // Disable button during upload

   const [actorNames, setActorNames] = useState(""); 

  const handleEpisodeChange = (index, field, value) => {
    const updated = [...episodes];
    updated[index][field] = value;
    setEpisodes(updated);
  };

  const addEpisode = () => {
    setEpisodes([...episodes, { title: "", file: null }]);
  };

  const handleUpload = async () => {
    if (!title || !description || episodes.length === 0 || !thumbnail || !trailer) {
      return alert("Please fill all fields including trailer and thumbnail.");
    }

    for (let i = 0; i < episodes.length; i++) {
      if (!episodes[i].title || !episodes[i].file) {
        return alert(`Episode ${i + 1} must have a title and a video file.`);
      }
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("freeEpisodeIndex", freeEpisodeIndex);
    formData.append("thumbnail", thumbnail);
    formData.append("trailer", trailer);

    episodes.forEach((ep) => {
      formData.append("episodeTitles", ep.title);
      formData.append("videos", ep.file);
    });

    try {
      setIsUploading(true);
      setUploadProgress(1);

      const res = await axiosInstance.post("/api/videos/upload-series", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent >= 100 ? 99 : percent); // cap at 99% until server responds
        },
      });

      setUploadProgress(100); // mark 100 only after server confirms success

      alert("✅ Series uploaded!");

      // Reset form
      setTitle("");
      setDescription("");
      setThumbnail(null);
      setTrailer(null);
      setEpisodes([{ title: "", file: null }]);
      setFreeEpisodeIndex(null);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        <Film className="text-blue-600" /> Upload New Series
      </h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-4 border">
        <div>
          <label className="block font-semibold mb-1">🎬 Series Title</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter series title"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">📝 Description</label>
          <textarea
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter series description"
            rows={4}
          />
        </div>






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







        <div className="space-y-3">
          <label className="block font-semibold">🖼 Thumbnail Image</label>
          <div className="flex items-center gap-4">
            <ImageIcon className="text-gray-500" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block font-semibold">🎞 Trailer Video</label>
          <div className="flex items-center gap-4">
            <Video className="text-gray-500" />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setTrailer(e.target.files[0])}
            />
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Plus className="text-green-600" /> Episodes
        </h3>

        {episodes.map((ep, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-lg border shadow-sm space-y-3">
            <h4 className="font-semibold text-lg">🎬 Episode {idx + 1}</h4>
            <input
              type="text"
              placeholder="Episode Title"
              className="w-full border px-4 py-2 rounded"
              value={ep.title}
              onChange={(e) => handleEpisodeChange(idx, "title", e.target.value)}
            />
            <input
              type="file"
              accept="video/*"
              className="w-full"
              onChange={(e) => handleEpisodeChange(idx, "file", e.target.files[0])}
            />
            <div className="flex items-center gap-2 pt-2">
              <input
                type="radio"
                name="freeEpisode"
                checked={freeEpisodeIndex === idx}
                onChange={() => setFreeEpisodeIndex(idx)}
              />
              <label className="text-sm text-gray-700">Mark as free episode</label>
            </div>
          </div>
        ))}

        <button
          onClick={addEpisode}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Episode
        </button>
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress > 0 && (
        <div className="mt-6">
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-700 mt-2 text-center">
            {uploadProgress < 100
              ? `${uploadProgress}% Uploaded`
              : "Upload complete. Finalizing..."}
          </p>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center gap-2`}
        >
          <Upload className="w-5 h-5" />
          {isUploading ? "Uploading..." : "Upload Series"}
        </button>
      </div>
    </div>
  );
};

export default UploadSeries;

import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, { autoConnect: false });

const WatchPartyRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialMovieUrl = query.get("movieUrl") || "";

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMovieUrl, setSelectedMovieUrl] = useState(initialMovieUrl);

  const videoRef = useRef(null);

  // Step 1: Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const name = storedUser?.name?.trim() || "Guest";
    setUsername(name);
  }, []);

  // Step 2: Connect socket and emit join only after username is set
  useEffect(() => {
    if (!username || !roomId) return;

    if (!socket.connected) socket.connect();

    socket.emit("join-room", { roomId, username });

    socket.on("user-joined", (msg) => {
      setMessages((prev) => [...prev, { system: true, text: msg }]);
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("sync-video", ({ action, currentTime, videoUrl }) => {
      if (!videoRef.current) return;

      if (videoUrl && videoRef.current.src !== videoUrl) {
        videoRef.current.src = videoUrl;
        videoRef.current.load();
      }

      if (Math.abs(videoRef.current.currentTime - currentTime) > 1) {
        videoRef.current.currentTime = currentTime;
      }

      if (action === "play") videoRef.current.play();
      else if (action === "pause") videoRef.current.pause();
    });

    return () => {
      socket.off("user-joined");
      socket.off("receive-message");
      socket.off("sync-video");
    };
  }, [username, roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      username,
      message,
    });

    setMessage("");
  };

  const handleVideoAction = (action) => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const videoUrl = videoRef.current.src;

    socket.emit("video-action", {
      roomId,
      action,
      currentTime,
      videoUrl,
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Video Section */}
      <div className="w-full md:w-2/3 bg-black p-4 flex flex-col">
        <video
          ref={videoRef}
          src={selectedMovieUrl}
          controls
          onPlay={() => handleVideoAction("play")}
          onPause={() => handleVideoAction("pause")}
          className="w-full h-[75vh] rounded"
        />
      </div>

      {/* Chat Section */}
      <div className="w-full md:w-1/3 border-l border-gray-300 p-4 flex flex-col bg-white shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">💬 Chat Room</h2>
          <span className="text-sm text-gray-600">
            You: <span className="font-semibold">{username}</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-100 p-3 rounded mb-2 space-y-2">
          {messages.map((msg, i) =>
            msg.system ? (
              <p key={i} className="text-center text-xs text-gray-500 italic">
                {msg.text}
              </p>
            ) : msg.username === username ? (
              <div key={i} className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-[70%] text-sm shadow">
                  {msg.message}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className="bg-gray-300 text-black px-4 py-2 rounded-lg max-w-[70%] text-sm shadow">
                  <span className="block font-semibold text-xs text-gray-700">
                    {msg.username}
                  </span>
                  {msg.message}
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex space-x-2 mt-1">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border p-2 rounded text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchPartyRoom;

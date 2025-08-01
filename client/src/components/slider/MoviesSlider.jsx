import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import { Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const MovieSlider = () => {
  const [movies, setMovies] = useState([]);
  const scrollRef = useRef(null);
  const isHoveredRef = useRef(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get("/api/videos/movies");
        setMovies(res.data.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        
      }
    };
    fetchMovies();
  }, []);

  /**
   * Smoothly scrolls an element horizontally by a given distance over a duration.
   * @param {HTMLElement} element - The DOM element to scroll.
   * @param {number} distance - The distance to scroll in pixels.
   * @param {number} duration - The duration of the scroll animation in milliseconds.
   */
  const smoothScrollBy = (element, distance, duration = 400) => {
    if (!element) return;
    const start = element.scrollLeft;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smoother animation (easeInOutQuad)
      const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      element.scrollLeft = start + distance * easedProgress;
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };


   




  //addCategoryMovie to userDatabase:
const navigate= useNavigate()

const {user}= useAuth()
const userId = user.id

const handleMovieClick = async (movie) => {
    if (!userId) {
      console.warn("Register with us!. Redirecting to login...");
      navigate("/login");
      return;
    }

    try {
      console.log("Sending to backend:", {
        userId,
        movieId: movie._id,
        category: movie.category,
      });

      await axiosInstance.post("/users/add-liked-category", {
        userId,
        movieId: movie._id,
      });

      console.log("Category sent successfully. Navigating to movie page...");
      navigate(`/movie/${movie._id}`);
    } catch (error) {
      console.error("Failed to add liked category:", error);
      navigate(`/movie/${movie._id}`); // fallback
    }
  };












  
  useEffect(() => {
    const cardWidth = 220; // Base width for cards
    const gap = 16;       // Gap between cards
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let intervalId;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (isHoveredRef.current) return;

        const maxScrollLeft =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;

        
        if (currentScroll >= maxScrollLeft - (cardWidth + gap) / 2) {
          // Smooth scroll back to start
          smoothScrollBy(scrollContainer, -currentScroll, 800); // Slower scroll back
        } else {
          // Scroll forward by one card + gap
          smoothScrollBy(scrollContainer, cardWidth + gap, 800);
        }
      }, 3000); // Increased interval for smoother, less frequent scrolls
    };

    startAutoScroll();

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  
  useEffect(() => {
    isHoveredRef.current = hoveredIndex !== null;
  }, [hoveredIndex]);

  /**
   * Calculates a translateX offset for neighboring cards when one is hovered.
   * This previously created a "push" or "spread" effect but is now largely
   * set to 0 as the main card scaling is removed.
   * @param {number} index - The index of the current card.
   * @returns {number} The translateX value in pixels.
   */
  const getHoverOffset = (index) => {
    // With no card scaling, this offset is no longer needed for the "push" effect
    // We'll keep it returning 0 to simplify
    return 0;
  };

  return (
    // Main container for the slider section
    <div className="py-16 relative z-10 overflow-hidden bg-black text-white font-inter">
      <h2 className="text-2xl font-bold mb-4 px-6 md:px-8 text-white">🔥 Top Movies</h2>

      {/* Scrollable container for movie cards */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto px-6 md:px-8 gap-4 scrollbar-hide relative z-0 w-full no-scrollbar"
        style={{
          scrollBehavior: "smooth",
         
          perspective: "1000px"
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {movies.map((movie, index) => {
            const isCurrentHovered = hoveredIndex === index;

          
            const cardTranslateY = 0;
            const cardScale = 1;
            
            const cardOpacity = hoveredIndex === null || isCurrentHovered ? 1 : 0.4;
            const cardZIndex = isCurrentHovered ? 50 : 10;

            const cardTranslateX = getHoverOffset(index); // This will now always return 0
            const rotateY = 0; // No Y-axis rotation
            const rotateX = 0; // No X-axis rotation
            const translateZ = 0; // No Z-axis translation

            return (
                // Individual movie card container (motion.div for Framer Motion animations)
                <motion.div
                onClick={() => handleMovieClick(movie)}
                    key={movie._id}
                    onMouseEnter={() => setHoveredIndex(index)}
                    animate={{
                        scale: cardScale,      // Always 1
                        y: cardTranslateY,     // Always 0
                        opacity: cardOpacity,  // Dims non-hovered, full opacity for hovered
                        zIndex: cardZIndex,    // Bring hovered to front
                        x: cardTranslateX,     // Always 0
                        rotateY: rotateY,      // Always 0
                        rotateX: rotateX,      // Always 0
                        z: translateZ,         // Always 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative flex-shrink-0 transition-all duration-300 rounded-xl overflow-visible"
                    style={{
                        width: 220,
                        height: 330,
                        borderRadius: "0.75rem",
                        transformOrigin: "center center",
                        transformStyle: "preserve-3d" // Keeping for potential future 3D use, but not strictly needed now
                    }}
                >
                    {/* Link to movie details page */}
                    <Link to={`/movie/${movie._id}`}>
                        <motion.div
                            className="w-full h-full rounded-xl bg-black shadow-xl hover:shadow-2xl hover:shadow-[#ffffff25] transition-all duration-300 group"
                            style={{ borderRadius: "0.75rem" }}
                        >
                            {/* Movie thumbnail image or placeholder */}
                            {movie.thumbnail ? (
                                <img
                                    src={movie.thumbnail}
                                    alt={movie.title}
                                    className="w-full h-full object-cover object-center rounded-xl transition-all duration-300 group-hover:scale-105" // Subtle scale on image hover still active if desired
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/220x330/334155/ffffff?text=Image+Error`; }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-sm rounded-xl">
                                    No Thumbnail
                                </div>
                            )}

                            {/* Overlay with play button and title, appears on hover */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isCurrentHovered ? 1 : 0, // Overlay appears/disappears with hover
                                    y: isCurrentHovered ? 0 : 20,
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-xl p-2"
                            >
                                {/* Play Button - maintains its whileHover and whileTap effects */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.2 }}
                                    className="bg-white text-black rounded-full p-3 mb-3 shadow-xl hover:shadow-white/40 transition-all duration-200"
                                    aria-label={`Play ${movie.title}`}
                                >
                                    <Play className="w-5 h-5" />
                                </motion.button>
                                {/* Movie Title */}
                                <p className="text-sm md:text-base font-semibold text-center px-2 font-inter truncate w-full">
                                    {movie.title}
                                </p>
                            </motion.div>
                        </motion.div>
                    </Link>
                </motion.div>
            );
        })}
      </div>

      {/* Custom CSS for scrollbar hiding */}
      <style>
        {`
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }

        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        `}
      </style>
    </div>
  );
};

export default MovieSlider;

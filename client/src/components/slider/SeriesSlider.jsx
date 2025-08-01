import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import { Play } from "lucide-react"; // Import Play icon for consistency
import { Link } from "react-router-dom";

const SeriesSlider = () => {
  const [series, setSeries] = useState([]);
  const scrollRef = useRef(null);
  const isHoveredRef = useRef(false); // Ref to track if any card is hovered (for auto-scroll)
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track individually hovered card

  /**
   * Fetches series data from the API when the component mounts.
   */
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axiosInstance.get("/api/videos/Series");
        setSeries(res.data.data);
      } catch (error) {
        console.error("Error fetching Series:", error);
      }
    };
    fetchSeries();
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

  /**
   * Manages the auto-scrolling behavior of the series slider.
   * It pauses when any card is hovered and resumes when not.
   */
  useEffect(() => {
    const cardWidth = 220; // Base width for cards (adjusted from 200px in original for consistency with MovieSlider)
    const gap = 16;       // Gap between cards
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let intervalId;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (isHoveredRef.current) return; // Pause auto-scroll if any card is hovered

        const maxScrollLeft =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;

        // Determine if we are near the end to loop back
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
  }, []); // Re-run effect only when isHoveredRef changes, which is controlled by hoveredIndex

  /**
   * Updates the `isHoveredRef` whenever `hoveredIndex` changes,
   * used to pause/resume auto-scrolling.
   */
  useEffect(() => {
    isHoveredRef.current = hoveredIndex !== null;
  }, [hoveredIndex]);


  return (
    <div className="py-6 relative z-10 overflow-hidden bg-black text-white font-inter"> {/* Added overflow-hidden */}
      <h2 className="text-2xl font-bold mb-4 px-6 md:px-8 text-white">📺 Top Series</h2> {/* Consistent padding */}
      <div
        ref={scrollRef}
        // Removed onMouseEnter/onMouseLeave from here, handled by individual cards' onMouseEnter/onMouseLeave
        className="flex overflow-x-auto px-6 md:px-8 gap-4 scrollbar-hide relative z-0 w-full no-scrollbar" // Consistent padding and gap
        style={{
          scrollBehavior: "smooth",
          perspective: "1000px" // Keeping perspective as it doesn't harm
        }}
        onMouseLeave={() => setHoveredIndex(null)} // Reset hover state when mouse leaves the entire slider area
      >
        {series.map((s, index) => {
          const isCurrentHovered = hoveredIndex === index;

          // No "pop-out" effects (scale, lift, rotation, translateZ) for the card itself
          const cardTranslateY = 0;
          const cardScale = 1;
          // Cards will dim when not hovered, but the hovered one remains at full opacity
          const cardOpacity = hoveredIndex === null || isCurrentHovered ? 1 : 0.4;
          const cardZIndex = isCurrentHovered ? 50 : 10;

          // No translateX offset for neighbors as card is not scaling
          const cardTranslateX = 0;
          const rotateY = 0;
          const rotateX = 0;
          const translateZ = 0;

          return (
            <motion.div
              key={s._id}
              onMouseEnter={() => setHoveredIndex(index)}
              // onMouseLeave is handled by the parent div onMouseLeave
              animate={{
                scale: cardScale,
                y: cardTranslateY,
                opacity: cardOpacity,
                zIndex: cardZIndex,
                x: cardTranslateX,
                rotateY: rotateY,
                rotateX: rotateX,
                z: translateZ,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative flex-shrink-0 transition-all duration-300 rounded-xl overflow-visible"
              style={{
                width: 220, // Consistent width with MovieSlider
                height: 330, // Consistent height with MovieSlider
                borderRadius: "0.75rem",
                transformOrigin: "center center",
                transformStyle: "preserve-3d"
              }}
            >
              <Link to={`/series/${s._id}`}>
                <motion.div
                  className="w-full h-full rounded-xl bg-black shadow-md hover:shadow-2xl hover:shadow-[#ffffff25] transition-all duration-300 group"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <div className="relative w-full h-full"> {/* Removed overflow-hidden from here */}
                    {s.thumbnail ? (
                      <img
                        src={s.thumbnail}
                        alt={s.title}
                        className="w-full h-full object-cover object-center rounded-xl transition-all duration-300 group-hover:scale-105" // Subtle image scale
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/220x330/334155/ffffff?text=Image+Error`; }} // Fallback
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-sm rounded-xl">
                        No Thumbnail
                      </div>
                    )}

                    {/* Overlay with Play button and title */}
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
                          aria-label={`Play ${s.title}`}
                      >
                          <Play className="w-5 h-5" />
                      </motion.button>
                      {/* Series Title */}
                      <p className="text-sm md:text-base font-semibold text-center px-2 font-inter truncate w-full">
                        {s.title}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Custom CSS for scrollbar hiding (if not already global) */}
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

export default SeriesSlider;
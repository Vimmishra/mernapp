

import { motion } from "framer-motion";
import Aos from "aos";
import { useEffect } from "react";

// Assuming these components are located in the specified paths
import MovieSlider from "@/components/slider/MoviesSlider";
import SeriesSlider from "@/components/slider/SeriesSlider";
import MovieCategory from "@/components/slider/MovieCategory";
import Plans from "@/components/plan";
import ThrillerMovie from "@/components/slider/thrillerMovie";
import { useNavigate } from "react-router-dom";
import HorrorMovie from "@/components/slider/horrorMovie";
import RecommendedMovies from "@/components/slider/RecommendedMovies";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {

  const {user} = useAuth();

const navigate = useNavigate()

  useEffect(() => {
    Aos.init({
      duration: 800, // Slightly snappier
      once: true,
      easing: "ease-in-out",
    });
    Aos.refresh();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans overflow-x-hidden">
      {/* Hero Section - A more prominent welcome */}
      <section className="relative h-96 md:h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 px-6 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
            <span className="text-red-600">Stream</span> Your World
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8">
            Dive into an endless library of movies and series, curated just for
            you.
          </p>
          <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate('/movies')}
    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out"
  >
    Explore Now
  </motion.button>
        </motion.div>
        {/* Optional: Add a subtle background image or video here */}
         <img src="netflix2.jpg" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover" /> 
      </section>

      <div className="px-4 py-12 space-y-16 md:px-8 lg:px-12 xl:px-16">
        {/* Section for Trending Movies */}
        <section data-aos="fade-up">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 border-l-4 border-red-600 pl-4 text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="mr-2">🔥</span>Trending Movies
          </motion.h2>
          <MovieSlider />
        </section>

        {/* Section for Top Series */}
        <section data-aos="fade-up" data-aos-delay="100">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 border-l-4 border-red-600 pl-4 text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="mr-2">📺</span>Top Series
          </motion.h2>
          <SeriesSlider />
        </section>

        {/* Section for Movie Categories / Superhero Specials */}
        <section data-aos="fade-up" data-aos-delay="200">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 border-l-4 border-red-600 pl-4 text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="mr-2"></span>Superhero Specials
          </motion.h2>
          <MovieCategory category="superhero" />

          
        

        </section>






{/* recommended*/}

<section data-aos="fade-up" data-aos-delay="200">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 border-l-4 border-red-600 pl-4 text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="mr-2"></span> Selected for you
          </motion.h2>
        

          
          <RecommendedMovies userId={user.id}/>

        </section>








{/* thriller*/}

<section data-aos="fade-up" data-aos-delay="200">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 border-l-4 border-red-600 pl-4 text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="mr-2"></span>Thriller Specials
          </motion.h2>
        

          
          <ThrillerMovie/>

        </section>




{/* horror*/}
        
<section data-aos="fade-up" data-aos-delay="200">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 border-l-4 border-red-600 pl-4 text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="mr-2"></span>Horror Zone 
          </motion.h2>
        

          
          <HorrorMovie/>

        </section>

      </div>

      {/* Plans Section - Integrate seamlessly */}
      <section className="py-16 bg-gray-900" data-aos="fade-up" data-aos-delay="300">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-white"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Choose Your Plan
          </motion.h2>
          <Plans />
        </div>
      </section>

      {/* Custom CSS for scrollbar and smooth behavior */}
      <style jsx>{`
        /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
        ::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge, and Firefox */
        body {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Ensure smooth scrolling behavior where applied */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
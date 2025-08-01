import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

const CommunityNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchMovieNews = async () => {
      try {
        const res = await axiosInstance.get("/api/news/movie-news");
        setNews(res.data.data);
      } catch (err) {
        console.error("Failed to load movie news", err);
      }
    };
    fetchMovieNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">🎬 Latest Movie News</h2>

      {news.length === 0 ? (
        <p className="text-center text-gray-500">No news available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              {/* Image if available */}
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{new Date(article.published_at).toLocaleDateString()}</p>
                <p className="mt-2 text-gray-700 text-sm line-clamp-3">{article.description}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityNews;

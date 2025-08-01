import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { debounce } from "lodash";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { getSearchResults, resetSearchResults } from "@/store/movies/searchSlice";

const SearchPage = () => {
  const dispatch = useDispatch();
  const { isLoading, searchResults } = useSelector((state) => state.MovieSearch);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(initialKeyword);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length >= 3) {
        dispatch(getSearchResults(searchTerm));
        setSearchParams({ keyword: searchTerm });
      } else {
        dispatch(resetSearchResults());
        setSearchParams({});
      }
    }, 500),
    [dispatch, setSearchParams]
  );

  // Run search when keyword changes (debounced)
  useEffect(() => {
    debouncedSearch(keyword);
  }, [keyword, debouncedSearch]);

  // Reset on unmount
  useEffect(() => {
    return () => {
      dispatch(resetSearchResults());
    };
  }, [dispatch]);

  // Handle form submit (search now if ≥ 3 chars, else reset)
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed.length >= 3) {
      dispatch(getSearchResults(trimmed));
      setSearchParams({ keyword: trimmed });
    } else {
      dispatch(resetSearchResults());
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Search Movies & Series</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Search by title..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center mt-10">
          <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
        </div>
      )}

      {!isLoading && searchResults.length === 0 && keyword.length >= 3 && (
        <p className="text-center text-gray-400">No results found for "{keyword}".</p>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((item) => (
            <Link
              key={item._id}
              to={`/movie/${item._id}`}
              className="bg-gray-800 p-3 rounded hover:shadow-lg transition"
            >
              <img
                src={item.thumbnail || "/placeholder.jpg"}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-400 capitalize">{item.type}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

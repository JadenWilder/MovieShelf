
import { useCallback, useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getPopularMovies, searchMovies } from "../services/movieService";

function Home({ searchQuery = "" }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = searchQuery.trim()
        ? await searchMovies(searchQuery)
        : await getPopularMovies();

      setMovies(results);
    } catch (err) {
      setError(err.message || "Unable to load movies.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>{searchQuery.trim() ? "Search Results" : "Popular Movies"}</h2>
        <p>
          {searchQuery.trim()
            ? `Movies matching "${searchQuery}"`
            : "Discover and save your favorite films"}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadMovies} />
      ) : movies.length > 0 ? (
        <MovieGrid movies={movies} />
      ) : (
        <div className="empty-state">
          <p>No movies found. Try another search.</p>
        </div>
      )}
    </main>
  );
}

export default Home;

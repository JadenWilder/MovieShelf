import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMovies } from "../contexts/useMovies";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieDetails() {
  const { id } = useParams();
  const { addMovie, removeMovie, isInWatchlist } = useMovies();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const inWatchlist = isInWatchlist(Number(id));

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovie() {
      setLoading(true);
      setError("");
      setMovie(null);

      if (!API_KEY) {
        setError("TMDB API key is missing. Check your .env file.");
        setLoading(false);
        return;
      }

      try {
        const url = new URL(`${BASE_URL}/movie/${id}`);
        url.searchParams.set("api_key", API_KEY);

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Movie not found."
              : `Unable to load movie details (${response.status}).`
          );
        }

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load movie details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovie();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="main-content">
        <p>Loading movie details...</p>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="main-content">
        <p role="alert">{error || "Movie not found."}</p>
        <Link to="/">Back to Home</Link>
      </main>
    );
  }

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Year unknown";

  function handleWatchlistClick() {
    if (inWatchlist) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  }

  return (
    <main className="main-content movie-detail-page">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <section className="movie-detail-layout">
        <div className="movie-detail-poster">
          <img
            src={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : "https://placehold.co/300x450/222222/ffffff?text=No+Poster"
            }
            alt={`${movie.title} poster`}
          />
        </div>

        <div className="movie-detail-info">
          <h2>{movie.title}</h2>

          {movie.tagline && <p className="movie-tagline">{movie.tagline}</p>}

          <p>
            <strong>Release year:</strong> {releaseYear}
          </p>

          <p>
            <strong>Rating:</strong>{" "}
            ⭐ {Number(movie.vote_average || 0).toFixed(1)} / 10
          </p>

          {movie.runtime > 0 && (
            <p>
              <strong>Runtime:</strong> {movie.runtime} minutes
            </p>
          )}

          {movie.genres?.length > 0 && (
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
          )}

          <h3>Overview</h3>
          <p>{movie.overview || "No overview is available for this movie."}</p>

          <button
            type="button"
            className="watchlist-button"
            aria-pressed={inWatchlist}
            onClick={handleWatchlistClick}
          >
            {inWatchlist
              ? "✓ Remove from Watchlist"
              : "+ Add to Watchlist"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;
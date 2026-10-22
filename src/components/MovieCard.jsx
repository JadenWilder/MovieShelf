import { useState } from "react";
import { Link } from "react-router-dom";
import {
  isFavorite,
  toggleFavorite,
} from "../services/movieService";
import { useMovies } from "../contexts/useMovies";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  const [favorite, setFavorite] = useState(() => isFavorite(movie.id));

  const {
    addMovie,
    removeMovie,
    isInWatchlist,
  } = useMovies();

  const inWatchlist = isInWatchlist(movie.id);

  function handleFavoriteClick() {
    try {
      const saved = toggleFavorite(movie);
      setFavorite(saved);
    } catch {
      window.alert("Unable to update favorites. Please try again.");
    }
  }

  function handleWatchlistClick() {
    if (inWatchlist) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  }

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://placehold.co/300x450/222222/ffffff?text=No+Poster";

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Year unknown";

  return (
    <article className="movie-card">
      <Link
        to={`/movie/${movie.id}`}
        className="movie-poster movie-details-link"
        aria-label={`View details for ${movie.title}`}
      >
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          loading="lazy"
        />
      </Link>

      <div className="movie-info">
        <h3 className="movie-title">
          <Link
            to={`/movie/${movie.id}`}
            className="movie-title-link"
          >
            {movie.title}
          </Link>
        </h3>

        <div className="movie-details">
          <span className="movie-rating">
            ⭐ {Number(movie.vote_average || 0).toFixed(1)}
          </span>
          <span className="movie-year">{year}</span>
        </div>

        {movie.overview && (
          <p className="movie-overview">{movie.overview}</p>
        )}

        <button
          type="button"
          className={`favorite-button${favorite ? " favorited" : ""}`}
          aria-pressed={favorite}
          onClick={handleFavoriteClick}
        >
          {favorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
        </button>

        <button
          type="button"
          className={`watchlist-button${inWatchlist ? " watchlisted" : ""}`}
          aria-pressed={inWatchlist}
          onClick={handleWatchlistClick}
        >
          {inWatchlist
            ? "✓ Remove from Watchlist"
            : "+ Add to Watchlist"}
        </button>
      </div>
    </article>
  );
}

export default MovieCard;

import { useState } from "react";
import {
  isFavorite,
  toggleFavorite,
} from "../services/movieService";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  const [favorite, setFavorite] = useState(() => isFavorite(movie.id));

  function handleFavoriteClick() {
    try {
      const saved = toggleFavorite(movie);
      setFavorite(saved);
    } catch {
      window.alert("Unable to update favorites. Please try again.");
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
      <div className="movie-poster">
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          loading="lazy"
        />
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>

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
      </div>
    </article>
  );
}

export default MovieCard;

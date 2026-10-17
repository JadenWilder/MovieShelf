
import { useCallback, useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import { getFavorites } from "../services/movieService";

function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState(getFavorites);

  const loadFavorites = useCallback(() => {
    setFavoriteMovies(getFavorites());
  }, []);

  useEffect(() => {
    window.addEventListener("favoritesUpdated", loadFavorites);
    window.addEventListener("storage", loadFavorites);

    return () => {
      window.removeEventListener("favoritesUpdated", loadFavorites);
      window.removeEventListener("storage", loadFavorites);
    };
  }, [loadFavorites]);

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>My Favorites</h2>
        <p>Your saved movies collection</p>
      </div>

      {favoriteMovies.length > 0 ? (
        <MovieGrid movies={favoriteMovies} />
      ) : (
        <div className="empty-state">
          <p>
            No favorite movies yet. Start adding some from the home page!
          </p>
        </div>
      )}
    </main>
  );
}

export default Favorites;

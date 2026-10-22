import { useEffect, useState } from "react";
import { MovieContext } from "./MovieContextValue";

const WATCHLISTS_KEY = "movieshelf_watchlists";
const ACTIVE_WATCHLIST_KEY = "movieshelf_active_watchlist";

function createDefaultWatchlist() {
  return {
    id: "watchlist-default",
    name: "My Watchlist",
    movies: [],
  };
}

function loadWatchlists() {
  try {
    const saved = localStorage.getItem(WATCHLISTS_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every(
          (list) =>
            list &&
            typeof list.id === "string" &&
            typeof list.name === "string" &&
            Array.isArray(list.movies)
        )
      ) {
        return parsed;
      }
    }
  } catch {
    // Use a default watchlist if saved data is invalid.
  }

  return [createDefaultWatchlist()];
}

function loadActiveWatchlistId(watchlists) {
  try {
    const savedId = localStorage.getItem(ACTIVE_WATCHLIST_KEY);

    if (watchlists.some((list) => list.id === savedId)) {
      return savedId;
    }
  } catch {
    // Use the first watchlist if localStorage is unavailable.
  }

  return watchlists[0].id;
}

export function MovieProvider({ children }) {
  const [watchlists, setWatchlists] = useState(loadWatchlists);

  const [activeWatchlistId, setActiveWatchlistId] = useState(() =>
    loadActiveWatchlistId(loadWatchlists())
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        WATCHLISTS_KEY,
        JSON.stringify(watchlists)
      );
    } catch {
      console.error("Unable to save watchlists to localStorage.");
    }
  }, [watchlists]);

  useEffect(() => {
    try {
      localStorage.setItem(
        ACTIVE_WATCHLIST_KEY,
        activeWatchlistId
      );
    } catch {
      console.error("Unable to save the active watchlist.");
    }
  }, [activeWatchlistId]);

  const activeWatchlist =
    watchlists.find((list) => list.id === activeWatchlistId) ??
    watchlists[0];

  function createWatchlist(name) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return false;
    }

    const newList = {
      id: `watchlist-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: trimmedName,
      movies: [],
    };

    setWatchlists((current) => [...current, newList]);
    setActiveWatchlistId(newList.id);

    return true;
  }

  function deleteWatchlist(id) {
    if (watchlists.length <= 1) {
      return false;
    }

    const remaining = watchlists.filter((list) => list.id !== id);

    setWatchlists(remaining);

    if (activeWatchlistId === id) {
      setActiveWatchlistId(remaining[0].id);
    }

    return true;
  }

  function addMovie(movie, listId = activeWatchlistId) {
    setWatchlists((current) =>
      current.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        if (list.movies.some((item) => item.id === movie.id)) {
          return list;
        }

        return {
          ...list,
          movies: [...list.movies, movie],
        };
      })
    );
  }

  function removeMovie(movieId, listId = activeWatchlistId) {
    setWatchlists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              movies: list.movies.filter(
                (movie) => movie.id !== movieId
              ),
            }
          : list
      )
    );
  }

  function isInWatchlist(movieId, listId = activeWatchlistId) {
    const list = watchlists.find((item) => item.id === listId);

    return Boolean(
      list?.movies.some((movie) => movie.id === movieId)
    );
  }

  const value = {
    watchlists,
    activeWatchlistId,
    activeWatchlist,
    setActiveWatchlistId,
    createWatchlist,
    deleteWatchlist,
    addMovie,
    removeMovie,
    isInWatchlist,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}
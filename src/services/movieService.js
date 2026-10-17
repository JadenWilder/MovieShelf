
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";

async function fetchMovies(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error(
      "TMDB API key is missing. Check your .env file and restart the development server."
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `TMDB request failed (${response.status}). Please try again.`
    );
  }

  return response.json();
}

export async function getPopularMovies() {
  const data = await fetchMovies("/movie/popular");
  return data.results ?? [];
}

export async function searchMovies(query) {
  const data = await fetchMovies("/search/movie", {
    query: query.trim(),
    include_adult: "false",
  });

  return data.results ?? [];
}

const FAVORITES_KEY = "movieshelf_favorites";

export function getFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function isFavorite(movieId) {
  return getFavorites().some((movie) => movie.id === movieId);
}

export function toggleFavorite(movie) {
  const favorites = getFavorites();
  const alreadySaved = favorites.some((item) => item.id === movie.id);

  const updatedFavorites = alreadySaved
    ? favorites.filter((item) => item.id !== movie.id)
    : [...favorites, movie];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

  window.dispatchEvent(new Event("favoritesUpdated"));

  return !alreadySaved;
}

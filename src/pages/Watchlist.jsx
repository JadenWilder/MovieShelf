import { useState } from "react";
import MovieGrid from "../components/MovieGrid";
import { useMovies } from "../contexts/useMovies";

function Watchlist() {
  const {
    watchlists,
    activeWatchlistId,
    activeWatchlist,
    setActiveWatchlistId,
    createWatchlist,
    deleteWatchlist,
  } = useMovies();

  const [newListName, setNewListName] = useState("");
  const [message, setMessage] = useState("");

  function handleCreateWatchlist(event) {
    event.preventDefault();

    const created = createWatchlist(newListName);

    if (created) {
      setNewListName("");
      setMessage("");
    } else {
      setMessage("Enter a name for your new watchlist.");
    }
  }

  function handleDeleteWatchlist() {
    if (watchlists.length === 1) {
      setMessage("You must keep at least one watchlist.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${activeWatchlist.name}"? Its saved movies will be removed from this list.`
    );

    if (confirmed) {
      deleteWatchlist(activeWatchlistId);
      setMessage("");
    }
  }

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>My Watchlists</h2>
        <p>Create separate lists and save movies for later.</p>
      </div>

      <section className="watchlist-controls">
        <label htmlFor="watchlist-select">Choose a watchlist</label>

        <select
          id="watchlist-select"
          value={activeWatchlistId}
          onChange={(event) =>
            setActiveWatchlistId(event.target.value)
          }
        >
          {watchlists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>

        <form
          className="create-watchlist-form"
          onSubmit={handleCreateWatchlist}
        >
          <label htmlFor="new-watchlist-name">
            Create a new watchlist
          </label>

          <div className="watchlist-create-row">
            <input
              id="new-watchlist-name"
              type="text"
              value={newListName}
              onChange={(event) => setNewListName(event.target.value)}
              placeholder="Example: Movies for the Weekend"
              maxLength={60}
            />

            <button type="submit" className="watchlist-button">
              Create List
            </button>
          </div>
        </form>

        {watchlists.length > 1 && (
          <button
            type="button"
            className="delete-watchlist-button"
            onClick={handleDeleteWatchlist}
          >
            Delete Current Watchlist
          </button>
        )}

        {message && <p role="alert">{message}</p>}
      </section>

      <div className="content-header">
        <h2>{activeWatchlist.name}</h2>
        <p>
          {activeWatchlist.movies.length}{" "}
          {activeWatchlist.movies.length === 1 ? "movie" : "movies"} saved
        </p>
      </div>

      {activeWatchlist.movies.length > 0 ? (
        <MovieGrid movies={activeWatchlist.movies} />
      ) : (
        <div className="empty-state">
          <p>
            This watchlist is empty. Visit Home and add movies to get started.
          </p>
        </div>
      )}
    </main>
  );
}

export default Watchlist;
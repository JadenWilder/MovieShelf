import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query.trim());
    navigate("/");
  }

  function handleHomeClick() {
    setQuery("");
    onSearch("");
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link
          to="/"
          className="app-title"
          onClick={handleHomeClick}
        >
          MovieShelf
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className="nav-link"
            onClick={handleHomeClick}
          >
            Home
          </Link>

          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>

          <Link to="/watchlist" className="nav-link">
            Watchlist
          </Link>
        </nav>

        <form className="search-container" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search movies..."
            className="search-input"
            aria-label="Search movies"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
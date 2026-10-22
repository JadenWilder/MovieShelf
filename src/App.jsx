import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import MovieDetails from "./pages/MovieDetails";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <div className="app">
        <Header onSearch={(query) => setSearchQuery(query)} />

        <Routes>
          <Route
            path="/"
            element={<Home searchQuery={searchQuery} />}
          />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
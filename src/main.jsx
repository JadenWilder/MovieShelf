import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { MovieProvider } from "./contexts/MovieContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MovieProvider>
      <App />
    </MovieProvider>
  </StrictMode>
);

import { useContext } from "react";
import { MovieContext } from "./MovieContextValue";

export function useMovies() {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("useMovies must be used inside a MovieProvider.");
  }

  return context;
}
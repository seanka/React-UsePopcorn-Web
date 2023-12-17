import { useState, useEffect } from "react";

const KEY = "c4d1fa9a";

export function useMovies(query, callback) {
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    callback?.();
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });

        if (!res.ok) throw new Error("No Connection");

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setError("");
        setIsLoading(false);
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return function () {
      controller.abort;
    };
  }, [query]);

  return { error, movies, isLoading };
}

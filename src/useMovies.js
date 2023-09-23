import { useEffect, useState } from "react";

const KEY = "4c217adc";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // this will only run when the component renders for the first time when the sencond argument is an empty array
  useEffect(() => {
    // callback?.();
    // For clean up function
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        // isLoading will display the text "Loading ..."
        setIsLoading(true);
        setError("");

        // API REQUEST
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        // Error handler
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        // Convert data to json
        const data = await res.json();

        // Error handler
        if (data.Response === "False") throw new Error("Movie not found");

        // State update with return API data
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        //Removes the "Loading ..." message
        setIsLoading(false);
      }
    };

    // END OFF API CALL

    // Aborts Use effect if search query is less than 3 characters
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // handleCloseMovie();
    // CALL API REQUEST function
    fetchMovies();

    // clean up function when query is being typed by user to prevent multiple data requests
    return function () {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}

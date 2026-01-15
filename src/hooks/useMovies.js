import { useEffect, useState } from 'react'

const KEY = process.env.REACT_APP_API_KEY

// name export function useMovies to be used in other files
export function useMovies(query) {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // useEffect runs after the component has been rendered
  useEffect(() => {
    // callback?.(); Optional chaining to call a function if it exists
    // For clean up function - use the AbortController to avoid multiple request when searching for a movie.
    const controller = new AbortController()

    const fetchMovies = async () => {
      try {
        // isLoading will display the text "Loading ..."
        setIsLoading(true)
        setError('')

        // API REQUEST
        // { signal: controller.signal } is used to abort the fetch request if needed
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        )

        // Error handler
        if (!res.ok)
          throw new Error('Something went wrong with fetching movies')

        // Convert data to json
        const data = await res.json()

        // Error handler
        if (data.Response === 'False') throw new Error('Movie not found')

        // Remove duplicate movies based on imdbID
        // Explanation: If the movie's imdbID has already been seen, it's a duplicate and we return false to filter it out. If it hasn't been seen, we add it to the set and return true to keep it in the filtered array.
        const seen = new Set()
        const dataFiltered = data.Search.filter((movie) => {
          if (seen.has(movie.imdbID)) return false
          seen.add(movie.imdbID)
          return true
        })

        // State update with return API data
        setMovies(dataFiltered)
        setError('')
      } catch (err) {
        // Error is from the fetch request itself
        // Abort error comes from the clean up function and is ignored
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        //Removes the "Loading ..." message
        setIsLoading(false)
      }
    }

    // END OFF API CALL

    // Aborts Use effect if search query is less than 3 characters
    if (query.length < 3) {
      setMovies([])
      setError('')
      return
    }

    // CALL API REQUEST function
    fetchMovies()

    // clean up function when query is being typed by user to prevent multiple data requests
    return function () {
      controller.abort()
    }
  }, [query])
  return { movies, isLoading, error }
}

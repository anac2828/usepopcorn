import { useState } from 'react'

import { useMovies } from './hooks/useMovies'
import { useLocalStorageState } from './hooks/useLocalStorateState'
import ErrorMessage from './components/utils/ErrorMessage'
import Box from './components/ui/Box'
import Loader from './components/utils/Loader'
import Logo from './components/ui/Logo'
import Main from './components/ui/Main'
import NavBar from './components/ui/NavBar'
import NumResults from './components/ui/NumResults'
import MovieDetails from './components/MovieDetails'
import MovieList from './components/MovieList'
import Search from './components/Search'
import WatchedMovieList from './components/WatchedMovieList'
import WatchedSummary from './components/WatchedSummary'

export default function App() {
  // * STATE MANAGEMENT *

  //? movie search query state
  const [query, setQuery] = useState('')
  // watched list state with local storage custom hook
  const [watched, setWatched] = useLocalStorageState([], 'watched')

  // selected movie id used to display details. null means no movie details are being displayed.
  const [selectedId, setSelectedId] = useState(null)

  // custom hook for fetching movies when the search query changes
  const { movies, isLoading, error } = useMovies(query)

  // * EVENT HANDLERS **

  function handleSelectMovie(id) {
    // null will close the movie details if the same movie is clicked again
    setSelectedId((selectedId) => (id === selectedId ? null : id))
  }

  // closes movie details
  function handleCloseMovie() {
    setSelectedId(null)
  }

  // Adds a movie to the watched list
  function handleAddWatchedMovie(movie) {
    // Updating watched list state with the new movie, ... by spreading the previous state and adding the new movie
    // Handled by the movie details component
    setWatched((watched) => [...watched, movie])

    // Saving watched List State
    // localStorage.setItem("watached", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  //! EFFECTS EXAMPLES
  // useEffect(() => {
  //   console.log('After inital render because of empty dependency array')
  // }, [])

  // useEffect(() => {
  //   console.log('After every render because there is no dependency arrry')
  // })

  // console.log('During render')

  // useEffect(() => {
  //   console.log('After every change of query:', query)
  // }, [query])

  return (
    <>
      <NavBar>
        <Logo />
        <Search
          query={query}
          setQuery={setQuery}
          onCloseMovie={handleCloseMovie}
        />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* element is an explicit prop. It is being used insted of the children prop */}
        {/* <Box element={<MovieList movies={movies} />} />

        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        /> */}

        {/* LIST OF MOVIES RETURNED FROM THE SEARCH QUERY */}
        <Box>
          {/* Loader */}
          {isLoading && <Loader />}

          {/* Displays movie list if isLoading === false and there are no errors  */}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}

          {/* Error message */}
          {error && <ErrorMessage message={error} />}
        </Box>

        {/* WATCHED MOVIES LIST AND MOVIE DETAILS */}
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}

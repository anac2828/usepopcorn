import { useEffect, useRef, useState } from 'react'
import { useKey } from '../hooks/useKey'
import Loader from './utils/Loader'
import StarRating from './StarRating'

const KEY = '4c217adc'
// ON SELECT MOVIE DETAILS COMPONENT **********
export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  //  STATE MANAGEMENT
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(null)
  const [userRating, setUserRating] = useState('')
  // DESTRUCTURING MOVIE OBJECT PROPERTIES returned FROM API
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  // isTop will always return false becase at render the imdbRating is not defined and setIstop is never called to updated the state
  // const [isTop, setIsTop] = useState(imdbRating > 8)

  // A solution would be to use a useEffect to update the state and re-render the component

  // useEffect(() => {
  //   setIsTop(imdbRating > 8)
  // }, [imdbRating])

  // But a much better way would be to use derived state. You get the imdbRating value when the component renders
  // const isTop = imdbRating > 8

  // Refs cannot be mutated when a component is rendering because the element is not yet present in the DOM. Use a useEffect to mutate the ref.
  // countRef will keep track of how many times the user has changed their rating for the movie
  const countRef = useRef(0)

  useEffect(() => {
    if (userRating) countRef.current++
  }, [userRating])

  const [IsInWatchedList] = watched.filter(
    (watched) => watched.imdbID === selectedId
  )

  const handleAddToWatchedList = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }

    // from app component
    onAddWatchedMovie(newWatchedMovie)
    onCloseMovie()
  }

  useKey('Escape', onCloseMovie)

  // FETCH MOVIE DETAILS WHEN selectedId CHANGES
  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true)
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      )
      const data = await res.json()
      setMovie(data)
      setIsLoading(false)
    }
    getMovieDetails()
  }, [selectedId, IsInWatchedList])

  useEffect(() => {
    if (!title) return
    document.title = `Movie: ${title}`

    // A clean up function is a function that is returned from an useEffect function. It will be executed when the component is unmounted.
    // In javascript this is a closure function and that is why the function remembers the variables
    return function () {
      document.title = 'usePopcorn'
    }
  }, [title])

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            {/* Close deatails button */}
            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            {/* Movie details */}
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            {/* Rating stars */}
            <div className='rating'>
              {selectedId !== IsInWatchedList?.imdbID ? (
                <>
                  {/* Render rating stars if movie is not in the wathched list*/}
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {/* Show the Add to list button if user rates the movie */}
                  {userRating > 0 && (
                    <button
                      className='btn-add'
                      onClick={handleAddToWatchedList}
                    >
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {IsInWatchedList?.userRating} ⭐️</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  )
}

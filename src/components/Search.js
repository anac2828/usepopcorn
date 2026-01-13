import { useRef } from 'react'
import { useKey } from '../hooks/useKey'

export default // Displays the search input field in the nav bar.
function Search({ query, setQuery, onCloseMovie }) {
  // useRef links the inputEl variable to a mutable ref object so that it can persist between renders without causing re-renders.
  const inputEl = useRef(null)

  //When the "Enter" key is pressed, the input field is focused and the query state is reset to an empty string.
  //@params key: the key to listen for
  //@params action: the function to call when the key is pressed
  useKey('Enter', () => {
    // If the input element is already focused, do nothing.
    if (document.activeElement === inputEl.current) return
    // If not focused when "Enter" is pressed, focus the input element and clear the search query.
    inputEl.current.focus()
    setQuery('')
    onCloseMovie()
  })

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      // this will connect the input element to the inputEl ref
      ref={inputEl}
    />
  )
}

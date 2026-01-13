import { useState } from 'react'
import { useEffect } from 'react'

export function useLocalStorageState(initalState, key) {
  // the useState callback returns the initial value if there is a movie stored in local storeage else the initalState will be returned. In this case the initialState is an empty array.
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : initalState
  })

  //SAVES WATCHED MOVIE LIST TO LOCAL STOREAGE WHEN A MOVIE IS ADDED TO THE WATCHED LIST
  // useEffect watches for changes in value and key. When either changes the callback function runs.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])
  return [value, setValue]
}

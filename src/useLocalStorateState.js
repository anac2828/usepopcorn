import { useState } from "react";
import { useEffect } from "react";

export function useLocalStorageState(initalState, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    // if (!storedValue) return (storedValue = []);
    return storedValue ? JSON.parse(storedValue) : initalState;
  });

  //SAVES WATCHED MOVIE LIST TO LOCAL STOREAGE WHEN A MOVIE IS ADDED TO THE WATCHED LIST
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}

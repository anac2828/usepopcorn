import { useEffect } from 'react';

export function useKey(key, action) {
  useEffect(() => {
    // event listener callback function
    // @params e: the event object
    const callback = (e) => {
      // If the key pressed matches the key passed to the hook, call the action function.
      if (e.code.toLowerCase() === key.toLowerCase()) action();
    };

    // adds an event listener to the whole HTML page that listens for keydown events and calls the callback function above
    document.addEventListener('keydown', callback);

    // clean up function that removes the event listener when the component unmounts or when the key or action changes
    return function () {
      document.removeEventListener('keydown', callback);
    };
  }, [action, key]);
}

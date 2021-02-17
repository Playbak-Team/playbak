import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T | string>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item || initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(value);
      // Save to local storage
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      // A more advanced implementation would handle the error case
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;

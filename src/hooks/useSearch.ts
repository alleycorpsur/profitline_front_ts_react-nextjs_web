import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook that returns a debounced value.
 *
 * This hook will delay updating the returned value until after
 * a specified delay has passed since the last time the value changed.
 *
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds for debouncing.
 * @returns {T} The debounced value.
 *
 * @example
 * const debouncedValue = useDebounce(value, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if the value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook that manages a search input with debouncing.
 *
 * This hook provides a search term and a debounced search term,
 * which updates after a specified delay. It also provides a
 * change handler for the input element.
 *
 * @param {number} [timeout=1000] - The debounce delay in milliseconds.
 * @returns {{
 *   searchTerm: string | undefined,
 *   querySearch: string | undefined,
 *   handleChangeSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
 * }} An object containing the search term, the debounced search term, and the change handler.
 *
 * @example
 * const { searchTerm, querySearch, handleChangeSearch } = useSearch(1000);
 */
export default function useSearch(timeout = 1000) {
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const debouncedSearchTerm = useDebounce(searchTerm, timeout);

  /**
   * Change handler for the search input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleChangeSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  return {
    searchTerm,
    searchQuery: debouncedSearchTerm,
    handleChangeSearch
  };
}

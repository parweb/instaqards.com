import { useCallback, useRef, useEffect } from 'react';
import type { SearchResult } from 'components/maps/types';
import { searchPlaces } from 'components/maps/services/nominatim';

interface SearchStateUpdates {
  results?: SearchResult[];
  isPopoverOpen?: boolean;
  isSearching?: boolean;
}

const MIN_QUERY_LENGTH = 3;

export const useSearchResults = (
  _: string,
  selectedLocation: SearchResult | null,
  // eslint-disable-next-line no-unused-vars
  updateSearchState: (updates: SearchStateUpdates) => void
) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSelecting = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filterResults = useCallback(
    (data: SearchResult[], currentLocation: SearchResult | null) => {
      if (!currentLocation) return data;

      return data.filter(
        result => result.display_name !== currentLocation.display_name
      );
    },
    []
  );

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();

      // Clear any pending search timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      if (
        trimmedQuery === '' ||
        trimmedQuery.length < MIN_QUERY_LENGTH ||
        isSelecting.current
      ) {
        updateSearchState({
          results: [],
          isPopoverOpen: false,
          isSearching: false
        });
        return;
      }

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Immediately set searching to true for UI feedback
      updateSearchState({ isSearching: true });

      try {
        const data = await searchPlaces(
          trimmedQuery,
          abortControllerRef.current.signal
        );
        const mappedData = data.map(result => ({
          ...result,
          lat: Number(result.lat),
          lon: Number(result.lon)
        }));
        const filteredResults = filterResults(mappedData, selectedLocation);

        updateSearchState({
          results: filteredResults,
          isSearching: false
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Search error:', error);
          updateSearchState({
            results: [],
            isPopoverOpen: false,
            isSearching: false
          });
        }
      }
    },
    [filterResults, selectedLocation, updateSearchState]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    handleSearch,
    isSelecting
  };
};

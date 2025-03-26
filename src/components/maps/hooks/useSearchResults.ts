import { useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import type { SearchResult } from 'components/maps/types';
import { searchPlaces } from 'components/maps/services/nominatim';

interface SearchStateUpdates {
  results?: SearchResult[];
  isPopoverOpen?: boolean;
  isSearching?: boolean;
}

const MIN_QUERY_LENGTH = 3;

export const useSearchResults = (
  query: string,
  selectedLocation: SearchResult | null,
  updateSearchState: (updates: SearchStateUpdates) => void
) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSelecting = useRef(false);

  const filterResults = useCallback(
    (data: SearchResult[], currentLocation: SearchResult | null) => {
      if (!currentLocation) return data;
      return data.filter(
        (result) => result.display_name !== currentLocation.display_name
      );
    },
    []
  );

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();

      if (
        trimmedQuery === '' ||
        trimmedQuery.length < MIN_QUERY_LENGTH ||
        isSelecting.current
      ) {
        updateSearchState({
          results: [],
          isPopoverOpen: false,
        });
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      updateSearchState({ isSearching: true });

      try {
        const data = await searchPlaces(trimmedQuery);
        const mappedData = data.map(result => ({
          ...result,
          lat: Number(result.lat),
          lon: Number(result.lon),
        }));
        const filteredResults = filterResults(mappedData, selectedLocation);

        updateSearchState({
          results: filteredResults,
          isPopoverOpen: filteredResults.length > 0,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
          toast.error('Failed to search for places. Please try again.');
          updateSearchState({ results: [], isPopoverOpen: false });
        }
      } finally {
        updateSearchState({ isSearching: false });
      }
    },
    [filterResults, selectedLocation, updateSearchState]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    handleSearch,
    isSelecting,
  };
}; 
import { useEffect, useCallback } from 'react';
import type { SearchResult } from 'components/maps/types';
import { useDebounce } from 'components/maps/hooks/useDebounce';
import { useSearchState } from './useSearchState';
import { useSearchResults } from './useSearchResults';
import { useMapPosition } from './useMapPosition';

interface UseMapSearchProps {
  onLocationSelect?: (location: SearchResult) => void;
}

const DEBOUNCE_DELAY = 300;

export const useMapSearch = ({ onLocationSelect }: UseMapSearchProps) => {
  const { searchState, updateSearchState, setQuery, clearSearch } =
    useSearchState();

  const { mapPosition, handleSelectLocation } = useMapPosition({
    onLocationSelect
  });

  const { handleSearch, isSelecting } = useSearchResults(
    searchState.query,
    searchState.selectedLocation,
    updateSearchState
  );

  const debouncedQuery = useDebounce(searchState.query, DEBOUNCE_DELAY);

  const handleSelectResult = useCallback(
    async (result: SearchResult) => {
      isSelecting.current = true;

      updateSearchState({
        isSearching: true,
        selectedLocation: result,
        query: result.display_name,
        isPopoverOpen: false,
        results: []
      });

      handleSelectLocation(result)
        .then(() => {
          updateSearchState({
            isSearching: false
          });
          isSelecting.current = false;
        })
        .catch(() => {
          updateSearchState({
            isSearching: false
          });
          isSelecting.current = false;
        });
    },
    [handleSelectLocation, updateSearchState]
  );

  return {
    query: searchState.query,
    setQuery,
    searchResults: searchState.results,
    isSearching: searchState.isSearching,
    selectedLocation: searchState.selectedLocation,
    isOpen: searchState.isPopoverOpen,
    setIsOpen: (isOpen: boolean) =>
      updateSearchState({ isPopoverOpen: isOpen }),
    mapPosition,
    isHandlingSelection: isSelecting,
    handleSearch,
    handleSelectResult,
    clearSearch,
    debouncedQuery
  };
};

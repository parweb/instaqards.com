import { useEffect } from 'react';
import type { SearchResult } from 'components/maps/types';
import { useDebounce } from '../../../hooks/useDebounce';
import { useSearchState } from './useSearchState';
import { useSearchResults } from './useSearchResults';
import { useMapPosition } from './useMapPosition';

interface UseMapSearchProps {
  onLocationSelect?: (location: {
    display_name: string;
    lat: number;
    lon: number;
  }) => void;
}

const DEBOUNCE_DELAY = 300;

export const useMapSearch = ({ onLocationSelect }: UseMapSearchProps) => {
  const {
    searchState,
    updateSearchState,
    setQuery,
    clearSearch,
  } = useSearchState();

  const { mapPosition, handleSelectLocation } = useMapPosition({
    onLocationSelect,
  });

  const { handleSearch, isSelecting } = useSearchResults(
    searchState.query,
    searchState.selectedLocation,
    updateSearchState
  );

  const debouncedQuery = useDebounce(searchState.query, DEBOUNCE_DELAY);

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const handleSelectResult = async (result: SearchResult) => {
    isSelecting.current = true;
    await handleSelectLocation(result);
    updateSearchState({
      selectedLocation: result,
      query: result.display_name,
      isPopoverOpen: false,
      results: [],
    });
    isSelecting.current = false;
  };

  return {
    query: searchState.query,
    setQuery,
    searchResults: searchState.results,
    isSearching: searchState.isSearching,
    selectedLocation: searchState.selectedLocation,
    isOpen: searchState.isPopoverOpen,
    setIsOpen: (isOpen: boolean) => updateSearchState({ isPopoverOpen: isOpen }),
    mapPosition,
    isHandlingSelection: isSelecting,
    handleSearch,
    handleSelectResult,
    clearSearch,
    debouncedQuery,
  };
}; 
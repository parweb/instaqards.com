import { useCallback } from 'react';

import { useDebounce } from 'components/maps/hooks/useDebounce';
import type { Location } from 'components/maps/types';
import { useMapPosition } from './useMapPosition';
import { useSearchResults } from './useSearchResults';
import { useSearchState } from './useSearchState';

interface UseMapSearchProps {
  // eslint-disable-next-line no-unused-vars
  onLocationSelect?: (location: Location) => void;
  query?: string;
}

const DEBOUNCE_DELAY = 300;

export const useMapSearch = ({
  onLocationSelect,
  query
}: UseMapSearchProps) => {
  const { searchState, updateSearchState, setQuery, clearSearch } =
    useSearchState({ query });

  const { mapPosition, handleSelectLocation } = useMapPosition({
    onLocationSelect
  });

  const { handleSearch, isSelecting } = useSearchResults(
    searchState.query,
    searchState.selected,
    updateSearchState
  );

  const debouncedQuery = useDebounce(searchState?.query ?? '', DEBOUNCE_DELAY);

  const handleSelectResult = useCallback(
    async (result: Location) => {
      isSelecting.current = true;

      updateSearchState({
        isSearching: true,
        selected: result,
        query: result.formatted_address,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSelectLocation, updateSearchState]
  );

  return {
    query: searchState.query,
    setQuery,
    searchResults: searchState.results,
    isSearching: searchState.isSearching,
    selected: searchState.selected,
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

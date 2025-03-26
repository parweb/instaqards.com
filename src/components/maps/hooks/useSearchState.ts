import { useState, useCallback } from 'react';
import type { SearchResult } from 'components/maps/types';

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  selectedLocation: SearchResult | null;
  isPopoverOpen: boolean;
}

const INITIAL_STATE: SearchState = {
  query: '',
  results: [],
  isSearching: false,
  selectedLocation: null,
  isPopoverOpen: false,
};

export const useSearchState = () => {
  const [searchState, setSearchState] = useState<SearchState>(INITIAL_STATE);

  const updateSearchState = useCallback((updates: Partial<SearchState>) => {
    setSearchState(prev => ({ ...prev, ...updates }));
  }, []);

  const setQuery = useCallback((newQuery: string) => {
    updateSearchState({ query: newQuery });
  }, [updateSearchState]);

  const clearSearch = useCallback(() => {
    updateSearchState({
      ...INITIAL_STATE,
      isPopoverOpen: false,
    });
  }, [updateSearchState]);

  return {
    searchState,
    updateSearchState,
    setQuery,
    clearSearch,
  };
}; 
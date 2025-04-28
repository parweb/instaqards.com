import { useCallback, useState } from 'react';

import type { Location } from 'components/maps/types';

interface SearchState {
  query: string;
  results: Location[];
  isSearching: boolean;
  selected: Location | null;
  isPopoverOpen: boolean;
}

const INITIAL_STATE: SearchState = {
  query: '',
  results: [],
  isSearching: false,
  selected: null,
  isPopoverOpen: false
};

export const useSearchState = (options: Partial<SearchState>) => {
  const [searchState, setSearchState] = useState<SearchState>({
    ...INITIAL_STATE,
    ...options
  });

  const updateSearchState = useCallback((updates: Partial<SearchState>) => {
    setSearchState(prev => ({ ...prev, ...updates }));
  }, []);

  const setQuery = useCallback(
    (newQuery: string) => {
      updateSearchState({ query: newQuery });
    },
    [updateSearchState]
  );

  const clearSearch = useCallback(() => {
    updateSearchState({
      ...INITIAL_STATE,
      isPopoverOpen: false
    });
  }, [updateSearchState]);

  return {
    searchState,
    updateSearchState,
    setQuery,
    clearSearch
  };
};

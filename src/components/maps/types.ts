import { z } from 'zod';

import type { Item } from 'components/maps/services/google-maps';

export type SearchResult = Item[];

export type Location = Item;

export interface SearchInputProps {
  query: string;
  isOpen: boolean;
  isSearching: boolean;
  searchResults: SearchResult;
  // eslint-disable-next-line no-unused-vars
  onQueryChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onResultSelect: (result: Location) => void;
  // eslint-disable-next-line no-unused-vars
  onClearSearch: (e: React.MouseEvent) => void;
  isHandlingSelection: React.MutableRefObject<boolean>;
}

export interface MapSearchProps {
  // eslint-disable-next-line no-unused-vars
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

export interface SearchInputFieldProps {
  query: string;
  isSearching: boolean;
  // eslint-disable-next-line no-unused-vars
  onQueryChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onClearSearch: (e: React.MouseEvent) => void;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export interface SearchResultsListProps {
  results: SearchResult;
  // eslint-disable-next-line no-unused-vars
  onSelect: (result: Location) => void;
}

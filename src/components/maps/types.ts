export interface SearchResult {
  id: string;
  display_name: string;
  lat: number;
  lon: number;
}

export interface Location {
  display_name: string;
  lat: number;
  lon: number;
}

export interface SearchInputProps {
  query: string;
  isOpen: boolean;
  isSearching: boolean;
  searchResults: SearchResult[];
  onQueryChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onResultSelect: (result: SearchResult) => void;
  onClearSearch: (e: React.MouseEvent) => void;
  isHandlingSelection: React.MutableRefObject<boolean>;
}

export interface MapSearchProps {
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

export interface SearchInputFieldProps {
  query: string;
  isSearching: boolean;
  onQueryChange: (value: string) => void;
  onClearSearch: (e: React.MouseEvent) => void;
  onOpenChange: (open: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export interface SearchResultsListProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
} 
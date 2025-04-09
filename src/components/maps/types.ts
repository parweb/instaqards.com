export interface SearchResult {
  id: string;
  display_name: string;
  lat: number;
  lon: number;
  address?: {
    suburb: string;
    city_district: string;
    city: string;
    'ISO3166-2-lvl6': string;
    state: string;
    'ISO3166-2-lvl4': string;
    region: string;
    country: string;
    country_code: string;
    house_number: string;
    road: string;
    postcode: string;
    municipality: string;
  };
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
  // eslint-disable-next-line no-unused-vars
  onQueryChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onResultSelect: (result: SearchResult) => void;
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
  results: SearchResult[];
  // eslint-disable-next-line no-unused-vars
  onSelect: (result: SearchResult) => void;
}

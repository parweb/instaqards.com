'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useMapSearch } from 'components/maps/hooks/useMapSearch';
import SearchInput from './SearchInput';
import MapContainer from './MapContainer';
import { cn } from 'lib/utils';

interface MapSearchProps {
  onLocationSelect?: (location: {
    display_name: string;
    lat: number;
    lon: number;
  }) => void;
  className?: string;
}

const MapSearch = ({ onLocationSelect, className }: MapSearchProps) => {
  const {
    query,
    setQuery,
    searchResults,
    isSearching,
    selectedLocation,
    isOpen,
    setIsOpen,
    mapPosition,
    isHandlingSelection,
    handleSearch,
    handleSelectResult,
    clearSearch,
    debouncedQuery
  } = useMapSearch({ onLocationSelect });

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const handleClearSearch = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      clearSearch();
    },
    [clearSearch]
  );

  const containerClassName = useMemo(
    () => cn('space-y-4', className),
    [className]
  );

  return (
    <div className={containerClassName}>
      <SearchInput
        query={query}
        isOpen={isOpen}
        isSearching={isSearching}
        searchResults={searchResults}
        onQueryChange={setQuery}
        onOpenChange={setIsOpen}
        onResultSelect={handleSelectResult}
        onClearSearch={handleClearSearch}
        isHandlingSelection={isHandlingSelection}
      />

      <MapContainer
        selectedLocation={selectedLocation}
        mapPosition={mapPosition}
      />
    </div>
  );
};

export default MapSearch;

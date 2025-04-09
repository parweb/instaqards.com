'use client';

import { useCallback, useEffect } from 'react';

import {
  Controller,
  ControllerRenderProps,
  type Control,
  type FieldValues
} from 'react-hook-form';

import { useMapSearch } from 'components/maps/hooks/useMapSearch';
import SearchInput from 'components/maps/SearchInput';
import type { Block as BlockType } from 'lib/utils';

const AddressInput = (
  props: ControllerRenderProps<FieldValues, string> & {
    // eslint-disable-next-line no-unused-vars
    onAddressChange: (location: {
      display_name: string;
      lat: number;
      lon: number;
    }) => void;
  }
) => {
  const {
    query,
    setQuery,
    searchResults,
    isSearching,
    isOpen,
    setIsOpen,
    isHandlingSelection,
    handleSearch,
    handleSelectResult,
    clearSearch,
    debouncedQuery
  } = useMapSearch({
    query: props.value,
    onLocationSelect: useCallback(
      (location: { display_name: string; lat: number; lon: number }) => {
        props.onChange([location.lat, location.lon]);
        props.onAddressChange(location);
      },
      [props]
    )
  });

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);

  const handleClearSearch = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      clearSearch();
    },
    [clearSearch]
  );

  return (
    <SearchInput
      query={query ?? props.value}
      isOpen={isOpen}
      isSearching={isSearching}
      searchResults={searchResults}
      onQueryChange={setQuery}
      onOpenChange={setIsOpen}
      onResultSelect={handleSelectResult}
      onClearSearch={handleClearSearch}
      isHandlingSelection={isHandlingSelection}
    />
  );
};

export const Address = ({
  control,
  name,
  setValue
}: {
  control: Control<FieldValues>;
  name: string;
  shape: Extract<BlockType, { kind: 'address' }>;
  data: Record<string, unknown>;
  setValue: (name: string, value: string) => void; // eslint-disable-line no-unused-vars
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <AddressInput
              {...field}
              onAddressChange={location =>
                setValue('address', location.display_name ?? '')
              }
            />
          );
        }}
      />
    </>
  );
};

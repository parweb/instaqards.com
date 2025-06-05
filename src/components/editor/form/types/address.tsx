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
import type { Location } from 'components/maps/types';
import type { Block as BlockType } from 'lib/utils';

const AddressInput = (props: ControllerRenderProps<FieldValues, string>) => {
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
    query: props?.value?.display_name ?? '',
    onLocationSelect: useCallback(
      (location: Location) => {
        props.onChange(location);
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
      query={query ?? props?.value?.display_name ?? ''}
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
  shape,
  data
}: {
  control: Control<FieldValues>;
  name: string;
  shape: Extract<BlockType, { kind: 'address' }>;
  data: Record<string, unknown>;
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return <AddressInput {...field} />;
        }}
      />
    </>
  );
};

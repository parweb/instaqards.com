'use client';

import { atom, useAtomValue } from 'jotai';
import { Suspense } from 'react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';

import { getGoogleFonts } from 'actions/google-fonts';
import { FontPicker } from 'components/font-picker';
import { ColorPicker } from 'components/ui/color-picker';
import { Input } from 'components/ui/input';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import type { Block as BlockType } from 'lib/utils';
import { LuAlignJustify, LuAlignRight } from 'react-icons/lu';
import { LuAlignCenter } from 'react-icons/lu';
import { LuAlignLeft } from 'react-icons/lu';

const $fonts = atom(async () => {
  const fonts = await getGoogleFonts();
  return fonts.map(font => font.family);
});

const FontLoading = () => {
  return (
    <FontPicker
      id="loading"
      name="loading"
      fonts={[]}
      onChange={() => {}}
      value={null}
    />
  );
};

const Family = ({
  control,
  name,
  fonts,
  defaultValue
}: {
  control: Control<FieldValues>;
  name: string;
  fonts: string[];
  defaultValue: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <FontPicker
            id={name}
            name={name}
            fonts={fonts}
            onChange={field.onChange}
            value={field.value}
          />
        );
      }}
    />
  );
};

const Size = ({
  name,
  control,
  defaultValue
}: {
  name: string;
  control: Control<FieldValues>;
  defaultValue: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <div className="w-[80px] relative">
            <Input
              name={name}
              type="number"
              className="pr-[27px]"
              value={field.value.replace('px', '')}
              onChange={e => {
                field.onChange(`${e.target.value}px`);
              }}
            />

            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-stone-500">
              px
            </span>
          </div>
        );
      }}
    />
  );
};

const Color = ({
  name,
  control,
  defaultValue
}: {
  control: Control<FieldValues>;
  name: string;
  defaultValue: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <ColorPicker
            name={name}
            value={field.value}
            onChange={field.onChange}
          />
        );
      }}
    />
  );
};

const Align = ({
  name,
  control,
  defaultValue
}: {
  name: string;
  control: Control<FieldValues>;
  defaultValue: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <Tabs
            defaultValue={field.value}
            onValueChange={field.onChange}
            className="flex-1"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="left">
                <span className="sr-only">Left</span>
                <LuAlignLeft />
              </TabsTrigger>
              <TabsTrigger value="center">
                <span className="sr-only">Center</span>
                <LuAlignCenter />
              </TabsTrigger>
              <TabsTrigger value="right">
                <span className="sr-only">Right</span>
                <LuAlignRight />
              </TabsTrigger>
              <TabsTrigger value="justify">
                <span className="sr-only">Justify</span>
                <LuAlignJustify />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        );
      }}
    />
  );
};

export const Font = (props: {
  control: Control<FieldValues>;
  shape: Extract<BlockType, { kind: 'font' }>;
  data: Record<string, unknown>;
}) => {
  const fonts = useAtomValue($fonts);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        {props.shape.default.color && (
          <Color
            name="font[color]"
            control={props.control}
            defaultValue={props.shape.default.color}
          />
        )}

        {props.shape.default.fontSize && (
          <Size
            name="font[fontSize]"
            control={props.control}
            defaultValue={props.shape.default.fontSize}
          />
        )}

        {props.shape.default.fontFamily && (
          <div className="flex-1">
            <Suspense fallback={<FontLoading />}>
              <Family
                name="font[fontFamily]"
                control={props.control}
                fonts={fonts}
                defaultValue={props.shape.default.fontFamily}
              />
            </Suspense>
          </div>
        )}
      </div>

      {props.shape.default.textAlign && (
        <div>
          <Align
            name="font[textAlign]"
            control={props.control}
            defaultValue={props.shape.default.textAlign}
          />
        </div>
      )}
    </div>
  );
};

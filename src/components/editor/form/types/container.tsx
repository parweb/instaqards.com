'use client';

import { Controller, type Control, type FieldValues } from 'react-hook-form';

import { ColorPicker } from 'components/ui/color-picker';
import { Input } from 'components/ui/input';
import type { Block as BlockType } from 'lib/utils';

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

export const Container = (props: {
  control: Control<FieldValues>;
  shape: Extract<BlockType, { kind: 'container' }>;
  data: Record<string, unknown>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        {props.shape.default.backgroundColor && (
          <Color
            name="container[backgroundColor]"
            control={props.control}
            defaultValue={props.shape.default.backgroundColor}
          />
        )}

        {props.shape.default.borderColor && (
          <Color
            name="container[borderColor]"
            control={props.control}
            defaultValue={props.shape.default.borderColor}
          />
        )}

        {props.shape.default.borderWidth && (
          <Size
            name="container[borderWidth]"
            control={props.control}
            defaultValue={props.shape.default.borderWidth}
          />
        )}

        {props.shape.default.borderRadius && (
          <Size
            name="container[borderRadius]"
            control={props.control}
            defaultValue={props.shape.default.borderRadius}
          />
        )}

        {props.shape.default.padding && (
          <Size
            name="container[padding]"
            control={props.control}
            defaultValue={props.shape.default.padding}
          />
        )}

        {props.shape.default.margin && (
          <Size
            name="container[margin]"
            control={props.control}
            defaultValue={props.shape.default.margin}
          />
        )}
      </div>
    </div>
  );
};

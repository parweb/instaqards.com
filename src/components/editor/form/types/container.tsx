'use client';

import { Controller, type Control, type FieldValues } from 'react-hook-form';

import { ColorPicker } from 'components/ui/color-picker';
import { Input } from 'components/ui/input';
import type { Block as BlockType } from 'lib/utils';

const Size = ({
  name,
  control,
  defaultValue,
  label
}: {
  name: string;
  control: Control<FieldValues>;
  defaultValue: string;
  label: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <div className="flex items-center gap-2">
            <label htmlFor={name} className="text-sm min-w-18 text-stone-500">
              {label}
            </label>

            <div className="w-[80px] relative">
              <Input
                id={name}
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
          </div>
        );
      }}
    />
  );
};

const Color = ({
  name,
  control,
  defaultValue,
  label
}: {
  control: Control<FieldValues>;
  name: string;
  defaultValue: string;
  label: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <div className="flex items-center gap-2">
            <label htmlFor={name} className="text-sm min-w-18 text-stone-500">
              {label}
            </label>

            <ColorPicker
              name={name}
              value={field.value}
              onChange={field.onChange}
            />
          </div>
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
    <div className="flex flex-col gap-4 p-4 border rounded bg-stone-50 shadow-sm">
      {props.shape.default.backgroundColor && (
        <Color
          label="Background"
          name="container[backgroundColor]"
          control={props.control}
          defaultValue={props.shape.default.backgroundColor}
        />
      )}

      {(props.shape.default.borderColor ||
        props.shape.default.borderWidth ||
        props.shape.default.borderRadius) && (
        <div className="flex flex-col gap-2 pt-3 border-t border-stone-200">
          <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">
            Border
          </span>

          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
            {props.shape.default.borderColor && (
              <Color
                label="Color"
                name="container[borderColor]"
                control={props.control}
                defaultValue={props.shape.default.borderColor}
              />
            )}

            {props.shape.default.borderWidth && (
              <Size
                label="Width"
                name="container[borderWidth]"
                control={props.control}
                defaultValue={props.shape.default.borderWidth}
              />
            )}

            {props.shape.default.borderRadius && (
              <Size
                label="Radius"
                name="container[borderRadius]"
                control={props.control}
                defaultValue={props.shape.default.borderRadius}
              />
            )}
          </div>
        </div>
      )}

      {(props.shape.default.padding || props.shape.default.margin) && (
        <div className="flex flex-col gap-2 pt-3 border-t border-stone-200">
          <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">
            Spacing
          </span>

          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
            {props.shape.default.padding && (
              <Size
                label="Padding"
                name="container[padding]"
                control={props.control}
                defaultValue={props.shape.default.padding}
              />
            )}

            {props.shape.default.margin && (
              <Size
                label="Margin"
                name="container[margin]"
                control={props.control}
                defaultValue={props.shape.default.margin}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

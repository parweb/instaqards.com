'use client';

import type { Block as BlockType } from 'lib/utils';
import { Input } from 'components/ui/input';
import { ColorPicker } from 'components/ui/color-picker';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
export const Color = (props: {
  control: Control<FieldValues>;
  name: string;
  shape: Extract<BlockType, { kind: 'color' }>;
  data: Record<string, unknown>;
}) => {
  console.log({ props });

  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        defaultValue={props.shape.default}
        render={({ field }) => {
          console.log({ field });

          return (
            <div className="flex flex-col gap-2">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-stone-500"
              >
                {props.shape.label}
              </label>

              <div className="flex gap-2">
                <div>
                  <ColorPicker
                    name={field.name}
                    value={field.value}
                    onChange={color => field.onChange(color)}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    id={field.name}
                    type="text"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          );
        }}
      />
    </>
  );
};

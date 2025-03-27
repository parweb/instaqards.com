'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Block, Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { Suspense, useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { LuChevronLeft } from 'react-icons/lu';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodToJsonSchema, type JsonSchema7Type } from 'zod-to-json-schema';

import { $lastSelected } from 'components/editor/form/BlockForm';
import { BlockFormButton } from 'components/editor/form/BlockFormButton';
import { Address } from 'components/editor/form/types/address';
import { Color } from 'components/editor/form/types/color';
import { Socials } from 'components/editor/form/types/socials';
import { Container } from 'components/editor/form/types/container';
import { Font } from 'components/editor/form/types/font';
import { Uploader } from 'components/editor/form/types/upload';
import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { createBlock, updateBlock } from 'lib/actions';
import { text, type Block as BlockType } from 'lib/utils';

const mutator = {
  create: createBlock,
  update: updateBlock
};

export function BlockPreview({
  mode,
  block,
  setSelectedBlock,
  siteId,
  type,
  ...props
}: {
  id: Block['id'] | null;
  mode: 'create' | 'update';
  block: Block['widget'];
  setSelectedBlock: Dispatch<SetStateAction<Block['widget']>>;
  type: Block['type'];
  siteId: Site['id'];
}) {
  const router = useRouter();
  const modal = useModal();

  const setLastSelected = useSetAtom($lastSelected);

  const [input, setInput] = useState(z.object({}));

  const [Component, setComponent] = useState<React.ComponentType<unknown>>(
    () => () => null
  );

  const [Editor, setEditor] = useState<React.ComponentType<unknown>>(
    () => () => null
  );

  const block_widget = block as unknown as { type: string; id: string } | null;
  const block_data = (block as unknown as { data: z.infer<typeof input> })
    ?.data;

  const block_widget_type = block_widget?.type ?? null;
  const block_widget_id = block_widget?.id ?? null;

  useEffect(() => {
    let mounted = true;

    import(
      `components/editor/blocks/${block_widget_type}/${block_widget_id}.tsx`
    )
      .then(module => {
        if (mounted) {
          module.default && setComponent(() => module.default);
          module.input && setInput(module.input);
          module.Editor && setEditor(() => module.Editor);
        }
      })
      .catch(error => {
        console.error('Failed to load component:', error);
      });

    return () => {
      mounted = false;
    };
  }, [block_widget_type, block_widget_id]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      ...block_data,

      widget: JSON.stringify(block_widget)
    },
    resolver: zodResolver(
      z.intersection(z.object({ widget: z.string() }), input)
    )
  });

  const { widget, ...data } = useWatch({ control });
  console.info({ widget });

  const widgetString = JSON.stringify({ ...block_widget, data });

  useEffect(() => {
    setValue('widget', widgetString);
  }, [widgetString, setValue]);

  return (
    <form
      className="flex-1 flex flex-col gap-4 h-full"
      onSubmit={handleSubmit(data => {
        const form = new FormData();

        for (const [key, value] of Object.entries(data)) {
          if (Array.isArray(value)) {
            for (const [i, item] of value.entries()) {
              for (const [attr, field] of Object.entries(item)) {
                // @ts-ignore
                form.append(`${key}[${i}][${attr}]`, field);
              }
            }
          } else form.append(key, value);
        }

        // @ts-ignore
        mutator[mode](form, siteId, mode === 'update' ? props.id : type).then(
          res => {
            if ('error' in res) {
              toast.error(res.error);
            } else {
              va.track(mode === 'create' ? 'Create block' : 'Update block', {
                id: res.id
              });

              router.refresh();
              modal?.hide();
              toast.success('Block saved!');
            }
          }
        );

        setLastSelected({ type: block_widget_type, id: block_widget_id });
      })}
    >
      <div className="flex-1 self-stretch overflow-y-scroll">
        <div className="flex flex-col gap-4">
          <div className="px-10 py-5 overflow-hidden relative flex flex-col gap-4">
            <div className="absolute z-10 inset-0 bg-black/30 pointer-events-auto" />

            <div className="z-20 ">
              <Suspense fallback={null}>
                <Component {...data} />
              </Suspense>
            </div>
          </div>

          <Controller
            control={control}
            name="widget"
            render={({ field }) => (
              <input
                type="hidden"
                {...field}
                value={JSON.stringify({ ...block_widget, data })}
              />
            )}
          />

          <div id="editor">
            <Suspense fallback={null}>
              <Editor />
            </Suspense>
          </div>

          <div className="px-4 flex flex-col gap-4 p-0.5">
            {(
              Object.entries(
                (zodToJsonSchema(input) as JsonSchema7Type['default'])
                  ?.properties ?? {}
              ) as [string, { description: string; type: string }][]
            )
              .map(
                ([key, property]) =>
                  [key, { ...property, shape: text(property.description) }] as [
                    never,
                    { description: string; type: string; shape: BlockType }
                  ]
              )
              .map(([key, property]) => {
                return (
                  <div key={key} className="flex flex-col gap-2">
                    {property.shape.kind === 'upload' && (
                      <>
                        {errors[key] && (
                          <p className="text-red-500 text-sm text-center">
                            {/* @ts-ignore */}
                            {errors[key]?.message?.toString()}
                          </p>
                        )}

                        <Uploader
                          {...register(key)}
                          data={data}
                          shape={property.shape}
                          // @ts-ignore
                          setValue={setValue}
                        />
                      </>
                    )}

                    {property.shape.kind === 'container' && (
                      <>
                        <Container
                          // @ts-ignore
                          control={control}
                          data={data}
                          shape={property.shape}
                        />

                        {errors[key] && (
                          <p className="text-red-500 text-sm text-center">
                            {/* @ts-ignore */}
                            {errors[key]?.message?.toString()}
                          </p>
                        )}
                      </>
                    )}

                    {property.shape.kind === 'address' && (
                      <>
                        <Address
                          // @ts-ignore
                          control={control}
                          name={key}
                          data={data}
                          shape={property.shape}
                          // @ts-ignore
                          setValue={setValue}
                        />

                        {errors[key] && (
                          <p className="text-red-500 text-sm text-center">
                            {/* @ts-ignore */}
                            {errors[key]?.message?.toString()}
                          </p>
                        )}
                      </>
                    )}

                    {property.shape.kind === 'font' && (
                      <>
                        <Font
                          // @ts-ignore
                          control={control}
                          data={data}
                          shape={property.shape}
                        />

                        {errors[key] && (
                          <p className="text-red-500 text-sm text-center">
                            {/* @ts-ignore */}
                            {errors[key]?.message?.toString()}
                          </p>
                        )}
                      </>
                    )}

                    {property.shape.kind === 'color' && (
                      <>
                        {errors[key] && (
                          <p className="text-red-500 text-sm text-center">
                            {/* @ts-ignore */}
                            {errors[key]?.message?.toString()}
                          </p>
                        )}

                        <Color
                          // @ts-ignore
                          control={control}
                          name={key}
                          data={data}
                          shape={property.shape}
                        />
                      </>
                    )}

                    {property.shape.kind === 'socials' && (
                      <>
                        <Socials
                          // @ts-ignore
                          control={control}
                          name={key}
                          data={data}
                          shape={property.shape}
                          // @ts-ignore
                          setValue={setValue}
                        />

                        {errors[key] && (
                          <p style={{ color: 'red' }}>
                            {/* @ts-ignore */}
                            {errors[key]?.message?.toString()}
                          </p>
                        )}
                      </>
                    )}
                    {property.shape.kind === 'number' && (
                      <>
                        <label
                          htmlFor={key}
                          className="text-sm font-medium text-stone-500"
                        >
                          {property.shape.label}
                        </label>

                        <Input
                          id={key}
                          type="number"
                          {...register(key, { valueAsNumber: true })}
                          defaultValue={property.shape.defaultValue}
                          placeholder={property.shape.label}
                        />

                        {errors[key] && (
                          <p style={{ color: 'red' }}>
                            {/* @ts-ignore */}
                            {errors[key]?.message?.toString()}
                          </p>
                        )}
                      </>
                    )}

                    {property.shape.kind === 'string' && (
                      <>
                        <label
                          htmlFor={key}
                          className="text-sm font-medium text-stone-500"
                        >
                          {property.shape.label}
                        </label>

                        <Input
                          id={key}
                          {...register(key)}
                          placeholder={property.shape.label}
                        />

                        {errors[key] && (
                          <p style={{ color: 'red' }}>
                            {/* @ts-ignore */}
                            {errors[key]?.message?.toString()}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
        <Button
          type="button"
          onClick={() =>
            // @ts-ignore
            setSelectedBlock(state => ({ ...state, type: null, id: null }))
          }
        >
          <LuChevronLeft />
        </Button>

        <div className="flex-1">
          <BlockFormButton />
        </div>
      </div>
    </form>
  );
}

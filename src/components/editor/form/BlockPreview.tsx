'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Block, Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { LuChevronLeft } from 'react-icons/lu';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodToJsonSchema, type JsonSchema7Type } from 'zod-to-json-schema';

import {
  Suspense,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react';

import { BlockFormButton } from 'components/editor/form/BlockFormButton';
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
  block: Block['widget'];
  setSelectedBlock: Dispatch<SetStateAction<Block['widget']>>;
  siteId: Site['id'];
  type: Block['type'];
} & ({ mode: 'create' } | { mode: 'update'; id: Block['id'] })) {
  const router = useRouter();
  const modal = useModal();

  const [input, setInput] = useState(z.object({}));

  const [Component, setComponent] = useState<React.ComponentType<unknown>>(
    () => () => null
  );

  const [Editor, setEditor] = useState<React.ComponentType<unknown>>(
    () => () => null
  );

  const block_widget = block as unknown as { type: string; id: string };
  const block_data = (block as unknown as { data: z.infer<typeof input> })
    ?.data;

  useEffect(() => {
    let mounted = true;

    import(
      `components/editor/blocks/${block_widget.type}/${block_widget.id}.tsx`
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
  }, [block_widget.type, block_widget.id]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: { ...block_data, widget: JSON.stringify(block_widget) },
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
          form.append(key, String(value));
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
      })}
    >
      <div className="flex-1 self-stretch overflow-y-scroll">
        <div className="px-10 py-5 overflow-hidden">
          <Suspense fallback={null}>
            <Component {...data} />
          </Suspense>
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

        <div className="px-4 flex flex-col gap-4">
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
                  <label
                    htmlFor={key}
                    className="text-sm font-medium text-stone-500"
                  >
                    {property.shape.label}
                  </label>

                  {property.shape.kind === 'upload' && (
                    <div>
                      <input type="file" id={key} {...register(key)} />
                    </div>
                  )}

                  {(property.type || property.shape.kind) === 'string' && (
                    <Input
                      id={key}
                      {...register(key)}
                      placeholder={property.shape.label}
                    />
                  )}

                  {errors[key] && (
                    <p style={{ color: 'red' }}>
                      {/* @ts-ignore */}
                      {errors[key]?.message?.toString()}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex gap-2 items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
        <Button type="button" onClick={() => setSelectedBlock(null)}>
          <LuChevronLeft />
        </Button>

        <div className="flex-1">
          <BlockFormButton />
        </div>
      </div>
    </form>
  );
}

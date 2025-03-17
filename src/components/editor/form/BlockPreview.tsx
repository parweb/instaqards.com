'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Block, Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { LuChevronLeft } from 'react-icons/lu';
import { toast } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
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
import { createBlock } from 'lib/actions';
import { text, type Block as BlockType } from 'lib/utils';

export function BlockPreview({
  block,
  setSelectedBlock,
  siteId,
  type
}: {
  block: { type: string; id: string };
  setSelectedBlock: Dispatch<
    SetStateAction<{ type: string; id: string } | null>
  >;
  siteId: Site['id'];
  type: Block['type'];
}) {
  const router = useRouter();
  const modal = useModal();

  const [input, setInput] = useState(z.object({}));

  const [Component, setComponent] = useState<React.ComponentType<unknown>>(
    () => () => null
  );

  const [Editor, setEditor] = useState<React.ComponentType<unknown>>(
    () => () => null
  );

  useEffect(() => {
    let mounted = true;

    import(`components/editor/blocks/${block.type}/${block.id}.tsx`)
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
  }, [block.type, block.id]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(
      z.intersection(z.object({ widget: z.string() }), input)
    )
  });

  const { widget, ...data } = useWatch({ control });
  console.log({ widget });

  const widgetString = JSON.stringify({ ...block, data });

  useEffect(() => {
    setValue('widget', widgetString);
  }, [widgetString, setValue]);

  return (
    <form
      className="flex-1 flex flex-col gap-4 h-full"
      onSubmit={handleSubmit(data => {
        console.log('Submitted data:', data);

        const form = new FormData();

        for (const [key, value] of Object.entries(data)) {
          form.append(key, String(value));
        }

        createBlock(form, siteId, type).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Create block', { id: res.id });

            router.refresh();
            modal?.hide();
            toast.success('Block created!');
          }
        });
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
              value={JSON.stringify({ ...block, data })}
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

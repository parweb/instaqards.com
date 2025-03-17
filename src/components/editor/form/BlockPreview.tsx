'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Block, Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
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

import { $lastSelected } from 'components/editor/form/BlockForm';
import { BlockFormButton } from 'components/editor/form/BlockFormButton';
import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { createBlock, updateBlock } from 'lib/actions';
import { cn, text, type Block as BlockType } from 'lib/utils';

const mutator = {
  create: createBlock,
  update: updateBlock
};

const Uploader = ({
  setValue,
  shape,
  ...props
}: {
  name: string;
  // eslint-disable-next-line no-unused-vars
  setValue: (name: string, file: File) => void;
  shape: Extract<BlockType, { kind: 'upload' }>;
}) => {
  console.log('Uploader', { props });

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: ([file]) => {
      if (!file) return;

      setValue(props.name, file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setMediaType((file.type.split('/').at(0) as 'video' | 'image') ?? null);

        setPreview(reader.result);
      };

      reader.readAsDataURL(file);
    },
    multiple: false,
    accept: shape.accept
  });

  return (
    <div className="relative flex flex-col gap-5">
      <div
        className={cn(
          'flex flex-col cursor-pointer transition-all p-4 border-2 border-dashed',
          'border-slate-500 rounded-md text-slate-400 hover:border-slate-900 hover:text-slate-900',
          isDragActive && 'border-slate-900 text-slate-900'
        )}
      >
        <div {...getRootProps()} className="text-center">
          <input {...getInputProps(props)} />

          {isDragActive ? (
            <>
              <p>Drop the files here</p>
              <p>Image or Video</p>
            </>
          ) : (
            <>
              <p>{"Drag 'n' drop some files here,"}</p>
              <p>or click to select files</p>
            </>
          )}
        </div>
      </div>

      {preview && false && (
        <>
          {mediaType === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="aspect-video object-contain"
              src={preview as string}
              alt="Upload preview"
            />
          )}

          {mediaType === 'video' && (
            <video className="aspect-video object-contain" controls>
              <source src={preview as string} />
              <track kind="captions" src="" label="no captions" />
            </video>
          )}
        </>
      )}
    </div>
  );
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
  siteId: Site['id'];
  type: Block['type'];
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
  console.info({ widget, data });

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
          form.append(key, value);
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
                        setValue={
                          // eslint-disable-next-line no-unused-vars
                          setValue as (name: string, file: File) => void
                        }
                        shape={property.shape}
                      />
                    </>
                  )}

                  {(property.type || property.shape.kind) === 'string' && (
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

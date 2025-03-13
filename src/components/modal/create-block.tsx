'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Block, Site } from '@prisma/client';
import va from '@vercel/analytics';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { LuChevronLeft } from 'react-icons/lu';
import { SocialIcon } from 'react-social-icons';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodToJsonSchema, type JsonSchema7Type } from 'zod-to-json-schema';

import {
  memo,
  Suspense,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react';

import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { SocialPicker } from 'components/ui/social-picker';
import { createBlock } from 'lib/actions';
import { cn, type BlockStyle } from 'lib/utils';
import { BlockTypes } from './BlockTypes';
import { useModal } from './provider';

const Content = ({
  type,
  data,
  setData,
  onClick
}: {
  type: Block['type'];
  data: {
    label: string;
    href: string;
    logo: string;
    filter: string | null;
    style: BlockStyle;
  };
  setData: Dispatch<
    SetStateAction<{
      label: string;
      href: string;
      logo: string;
      filter: string | null;
      style: BlockStyle;
    }>
  >;
  onClick: (data: { type: string; id: string }) => void;
}) => {
  return (
    <div className="h-[300px] overflow-y-scroll flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {type === 'main' && (
          <div>
            <input type="hidden" name="type" value={type} />
            <BlockTypes onClick={onClick} />
          </div>
        )}

        {type === 'social' && (
          <>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="label"
                className="text-sm font-medium text-stone-500"
              >
                Title
              </label>

              <Input
                id="label"
                name="label"
                type="text"
                placeholder="Title"
                value={data.label}
                onChange={e => setData({ ...data, label: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="href"
                className="text-sm font-medium text-stone-500 dark:text-stone-400"
              >
                Link
              </label>

              <div className="flex items-center gap-2">
                <div>
                  <SocialIcon
                    network={data.logo}
                    fallback={{ color: '#000000', path: 'M0' }}
                    style={{ width: 28, height: 28 }}
                  />
                </div>

                <Input
                  id="href"
                  name="href"
                  type="text"
                  placeholder="https://instagram.com/..."
                  value={data.href}
                  onChange={e => {
                    setData(state => ({ ...state, href: e.target.value }));

                    try {
                      const url = new URL(e.target.value);
                      const domain = url.hostname.replace('www.', '');
                      const logo = String(domain.split('.').at(0));

                      setData(state => ({ ...state, logo }));
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  required
                />
              </div>
            </div>

            <SocialPicker
              onChange={logo => setData({ ...data, logo })}
              value={data.logo}
            />
          </>
        )}
      </div>
    </div>
  );
};

const Preview = memo(
  ({
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
  }) => {
    const router = useRouter();
    const modal = useModal();

    const [Component, setComponent] =
      useState<React.ComponentType<unknown> | null>(null);
    const [input, setInput] = useState(z.object({}));

    useEffect(() => {
      let mounted = true;

      import(`components/blocks/${block.type}/${block.id}.tsx`)
        .then(module => {
          if (mounted) {
            setComponent(() => module.default);
            setInput(module.input || null);
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

    console.log({ errors });

    const { widget, ...data } = useWatch({ control });
    console.log({ widget });

    const widgetString = JSON.stringify({ ...block, data });

    useEffect(() => {
      setValue('widget', widgetString);
    }, [widgetString, setValue]);

    if (!Component || !input) return null;

    return (
      <form
        className="flex-1 flex flex-col gap-4 h-full"
        onSubmit={handleSubmit(data => {
          console.log('Submitted data:', data);

          const formData = new FormData();

          for (const [key, value] of Object.entries(data)) {
            console.log({ key, value });
            formData.append(key, String(value));
          }

          createBlock(formData, siteId, type).then(res => {
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

          <div className="px-4 flex flex-col gap-4">
            {(
              Object.entries(
                (zodToJsonSchema(input) as JsonSchema7Type['default'])
                  ?.properties ?? {}
              ) as [string, { description: string; type: string }][]
            ).map(([key, property]) => (
              <div key={key} className="flex flex-col space-y-2">
                <label
                  htmlFor={key}
                  className="text-sm font-medium text-stone-500"
                >
                  {property.description}
                </label>

                {property.type === 'string' && (
                  <Input
                    id={key}
                    // @ts-ignore
                    {...register(key)}
                    placeholder={property.description}
                  />
                )}

                {/* @ts-ignore */}
                {errors[key] && (
                  <p style={{ color: 'red' }}>
                    {/* @ts-ignore */}
                    {errors[key]?.message?.toString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
          <Button type="button" onClick={() => setSelectedBlock(null)}>
            <LuChevronLeft />
          </Button>

          <div className="flex-1">
            <CreateBlockFormButton />
          </div>
        </div>
      </form>
    );
  }
);

Preview.displayName = 'Preview';

export default function CreateBlockModal({ type }: { type: Block['type'] }) {
  const params = useParams();

  const [selectedBlock, setSelectedBlock] = useState<{
    type: string;
    id: string;
  } | null>(null);

  const [data, setData] = useState<{
    label: string;
    href: string;
    logo: string;
    filter: string | null;
    style: BlockStyle;
  }>({
    label: '',
    href: '',
    logo: '',
    filter: null,
    style: {
      hover: {
        color: '#000000',
        backgroundColor: '#ffffff',
        fontSize: '16',
        fontFamily: 'Open Sans',
        borderRadius: '10px'
      },
      normal: {
        color: '#ffffffe6',
        backgroundColor: '#00000000',
        fontSize: '16',
        fontFamily: 'Open Sans',
        borderRadius: '10px'
      }
    }
  });

  return (
    <div className="bg-white w-full rounded-md md:max-w-md md:border md:border-stone-200 md:shadow overflow-hidden">
      <div className="flex flex-col gap-4">
        <h2 className="font-cal text-2xl px-4 pt-4">Create a block</h2>

        <div className="relative">
          {selectedBlock !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <Preview
                  block={selectedBlock}
                  setSelectedBlock={setSelectedBlock}
                  siteId={params.id as Site['id']}
                  type={type}
                />
              </Suspense>
            </motion.div>
          )}

          <div
            className={cn('transition-all duration-300 bg-white px-4 pb-4', {
              '-translate-x-full pointer-events-none': selectedBlock !== null
            })}
          >
            <Content
              type={type}
              data={data}
              setData={setData}
              onClick={({ type, id }) => setSelectedBlock({ type, id })}
            />
          </div>
        </div>
      </div>

      {type === 'social' && (
        <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10">
          <CreateBlockFormButton />
        </div>
      )}
    </div>
  );
}

function CreateBlockFormButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn(
        'w-full',
        pending
          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400'
          : 'border-black bg-black text-white hover:bg-white hover:text-black'
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save</p>}
    </Button>
  );
}

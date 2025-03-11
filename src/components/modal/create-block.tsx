'use client';

import type { Block, Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useParams, useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { LuChevronLeft } from 'react-icons/lu';
import { SocialIcon } from 'react-social-icons';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import {
  Suspense,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Font } from 'actions/google-fonts';
import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { SocialPicker } from 'components/ui/social-picker';
import { useCurrentRole } from 'hooks/use-current-role';
import { createBlock } from 'lib/actions';
import { cn, type BlockStyle } from 'lib/utils';
import { useForm, useWatch } from 'react-hook-form';
import { BlockTypes } from './BlockTypes';
import { useModal } from './provider';

const Content = ({
  type,
  data,
  setData,
  css,
  fonts,
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
  css: BlockStyle;
  fonts: Font[];
  onClick: (data: { type: string; id: string }) => void;
}) => {
  const role = useCurrentRole();

  return (
    <div className="h-[300px] overflow-y-scroll flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {type === 'main' && (
          <div>
            {/* <input
              type="hidden"
              name="style"
              value={JSON.stringify(data.style)}
            />

            <Tabs defaultValue="normal" className="">
              <TabsList className="flex justify-between">
                {['normal', 'hover'].map(key => (
                  <TabsTrigger
                    key={`TabsTrigger-${key}`}
                    value={key}
                    className="flex-1"
                  >
                    {key}
                  </TabsTrigger>
                ))}
              </TabsList>

              {(['normal', 'hover'] as const).map(key => (
                <TabsContent key={`TabsContent-${key}`} value={key}>
                  <fieldset className="flex flex-col gap-4 border border-dashed rounded-md border-stone-200 p-4">
                    <legend className="px-2 text-sm font-medium text-stone-500 dark:text-stone-400">
                      {key}
                    </legend>

                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor={`${key}-color`}
                        className="text-sm font-medium text-stone-500 dark:text-stone-400"
                      >
                        Font
                      </label>

                      <div className="flex items-center gap-2">
                        <div>
                          <ColorPicker
                            key={`${key}-color`}
                            name={`${key}-color`}
                            value={css?.[key]?.color ?? '#000000ff'}
                            onChange={color =>
                              setData(state => ({
                                ...state,
                                style: {
                                  ...(css ?? {}),
                                  [key]: {
                                    ...(css?.[key] ?? {}),
                                    color
                                  }
                                }
                              }))
                            }
                          />
                        </div>

                        <div className="w-[80px] relative">
                          <Input
                            name={`${key}-fontSize`}
                            type="number"
                            className="pr-[27px]"
                            value={css?.[key]?.fontSize ?? '20'}
                            onChange={e =>
                              setData(state => ({
                                ...state,
                                style: {
                                  ...(css ?? {}),
                                  [key]: {
                                    ...(css?.[key] ?? {}),
                                    fontSize: e.target.value
                                  }
                                }
                              }))
                            }
                          />

                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                            px
                          </span>
                        </div>

                        <div className="flex-1">
                          <FontPicker
                            name={`${key}-fontFamily`}
                            fonts={fonts.map(font => font.family)}
                            onChange={fontFamily =>
                              setData(state => ({
                                ...state,
                                style: {
                                  ...(css ?? {}),
                                  [key]: {
                                    ...(css?.[key] ?? {}),
                                    fontFamily
                                  }
                                }
                              }))
                            }
                            value={css?.[key]?.fontFamily ?? ''}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor={`${key}-backgroundColor`}
                        className="text-sm font-medium text-stone-500 dark:text-stone-400"
                      >
                        Background color
                      </label>

                      <ColorPicker
                        key={`${key}-backgroundColor`}
                        name={`${key}-backgroundColor`}
                        value={css?.[key]?.backgroundColor ?? '#000000ff'}
                        onChange={backgroundColor =>
                          setData(state => ({
                            ...state,
                            style: {
                              ...(css ?? {}),
                              [key]: {
                                ...(css?.[key] ?? {}),
                                backgroundColor
                              }
                            }
                          }))
                        }
                      />
                    </div>
                  </fieldset>
                </TabsContent>
              ))}
            </Tabs> */}

            <input type="hidden" name="type" value={type} />
            <BlockTypes onClick={onClick} />
          </div>
        )}

        {type === 'social' && (
          <>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="label"
                className="text-sm font-medium text-stone-500 dark:text-stone-400"
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
                {type === 'social' && (
                  <div>
                    <SocialIcon
                      network={data.logo}
                      fallback={{ color: '#000000', path: 'M0' }}
                      style={{ width: 28, height: 28 }}
                    />
                  </div>
                )}

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

            <SocialPicker />
          </>
        )}
      </div>
    </div>
  );
};

const Preview = ({ block }: { block: { type: string; id: string } }) => {
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
    formState: { errors }
  } = useForm({
    resolver: zodResolver(input)
  });

  const data = useWatch({ control });

  if (!Component || !input) return null;

  return (
    <form
      className="flex-1 flex flex-col gap-4 p-1"
      onSubmit={handleSubmit(data => {
        console.log('Submitted data:', data);
      })}
    >
      {(
        Object.entries(zodToJsonSchema(input)?.properties ?? {}) as [
          string,
          { description: string; type: string }
        ][]
      ).map(([key, property]) => (
        <div key={key} className="flex flex-col space-y-2">
          <label
            htmlFor={key}
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            {property.description}
          </label>

          {property.type === 'string' && (
            <Input
              id={key}
              {...register(key)}
              placeholder={property.description}
            />
          )}

          {errors[key] && (
            <p style={{ color: 'red' }}>{errors[key]?.message?.toString()}</p>
          )}
        </div>
      ))}

      <div className="px-10 py-5 overflow-hidden">
        <Suspense fallback={null}>
          <Component {...data} />
        </Suspense>
      </div>
    </form>
  );
};

export default function CreateBlockModal({
  type,
  fonts
}: {
  type: Block['type'];
  fonts: Font[];
}) {
  const [selectedBlock, setSelectedBlock] = useState<{
    type: string;
    id: string;
  } | null>(null);

  const router = useRouter();
  const params = useParams();
  const modal = useModal();

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

  const css = data.style;

  return (
    <form
      className="bg-white w-full rounded-md md:max-w-md md:border md:border-stone-200 md:shadow"
      action={async (data: FormData) =>
        createBlock(data, params.id as Site['id'], type).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Create block', { id: res.id });

            router.refresh();
            modal?.hide();
            toast.success('Block created!');
          }
        })
      }
    >
      <div className="flex flex-col space-y-4 p-4">
        <h2 className="font-cal text-2xl">Create a block</h2>

        <div className="relative overflow-hidden p-0">
          {selectedBlock !== null && (
            <div className="absolute inset-0 flex flex-col gap-4">
              <Button type="button" onClick={() => setSelectedBlock(null)}>
                <LuChevronLeft />
              </Button>

              <div className="flex items-center justify-center">
                <Suspense fallback={null}>
                  <Preview block={selectedBlock} />
                </Suspense>
              </div>
            </div>
          )}

          <div
            className={cn('transition-all duration-300 bg-white', {
              '-translate-x-full': selectedBlock !== null,
              'pointer-events-none': selectedBlock !== null
            })}
          >
            <Content
              type={type}
              data={data}
              setData={setData}
              css={css}
              fonts={fonts}
              onClick={({ type, id }) => setSelectedBlock({ type, id })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateBlockFormButton />
      </div>
    </form>
  );
}

function CreateBlockFormButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(
        'flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none',
        pending
          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
          : 'border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800'
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save</p>}
    </button>
  );
}

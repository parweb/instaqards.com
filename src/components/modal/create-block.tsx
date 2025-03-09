'use client';

import type { Block, Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { SocialIcon } from 'react-social-icons';
import { toast } from 'sonner';

import type { Font } from 'actions/google-fonts';
import { FontPicker } from 'components/font-picker';
import LoadingDots from 'components/icons/loading-dots';
import { ColorPicker } from 'components/ui/color-picker';
import { Input } from 'components/ui/input';
import { SocialPicker } from 'components/ui/social-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { createBlock } from 'lib/actions';
import { cn, type BlockStyle } from 'lib/utils';
import { BlockTypesItemVariants } from './BlockTypesItemVariants';
import { useModal } from './provider';

const BlockTypesItem = ({
  label,
  type
}: {
  label: string;
  type: 'button' | 'picture' | 'text' | 'external';
}) => {
  const [selected, setSelected] = useState(0);

  const variants: {
    id: string;
    label: string;
    type: 'button' | 'picture' | 'text' | 'external';
  }[] = [
    { id: 'glow-up-001', label: 'Glow up 1', type: 'button' },
    { id: 'glow-up-002', label: 'Glow up 2', type: 'button' },
    { id: 'slide-from-left-001', label: 'Slide from left', type: 'button' },
    { id: 'dont-press-me-001', label: 'Dont press me', type: 'button' },
    { id: 'dont-press-me-002', label: 'Dont press me 2', type: 'button' },
    { id: 'dont-press-me-003', label: 'Dont press me 3', type: 'button' },
    { id: 'dont-press-me-004', label: 'Dont press me 4', type: 'button' },
    { id: 'dont-press-me-005', label: 'Dont press me 5', type: 'button' },
    { id: 'gold', label: 'Gold', type: 'button' },
    { id: 'shiny', label: 'Shiny', type: 'button' },

    { id: 'logo-circle', label: 'Logo circle', type: 'picture' },
    { id: 'logo-square', label: 'Logo square', type: 'picture' },
    { id: 'picture-16-9', label: 'Picture 16:9', type: 'picture' },

    { id: 'normal', label: 'Normal', type: 'text' },

    { id: 'spotify', label: 'Spotify', type: 'external' },
    { id: 'youtube', label: 'Youtube', type: 'external' },
    { id: 'tiktok', label: 'Tiktok', type: 'external' },
    { id: 'instagram', label: 'Instagram', type: 'external' }
  ];

  return (
    <div className="flex flex-col gap-2">
      <hgroup className="flex gap-2 items-center justify-between">
        <h3>{label}</h3>

        {/* <div className="flex gap-2">
          <Button
            disabled={selected === 0}
            type="button"
            onClick={() => setSelected(clamp(selected - 1, 0, 2))}
            variant="ghost"
            size="icon"
          >
            <LuArrowLeft />
          </Button>

          <Button
            disabled={selected === variants.length - 1}
            type="button"
            onClick={() => setSelected(clamp(selected + 1, 0, 2))}
            variant="ghost"
            size="icon"
          >
            <LuArrowRight />
          </Button>
        </div> */}
      </hgroup>

      <BlockTypesItemVariants
        selected={selected}
        variants={variants.filter(v => v.type === type)}
      />
    </div>
  );
};

const BlockTypes = () => {
  return (
    <div className="flex flex-col gap-4">
      <BlockTypesItem type="button" label="Boutons" />
      <BlockTypesItem type="picture" label="Images" />
      <BlockTypesItem type="text" label="Textes" />
      <BlockTypesItem type="external" label="Externes" />
    </div>
  );
};

export default function CreateBlockModal({
  type,
  fonts
}: {
  type: Block['type'];
  fonts: Font[];
}) {
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
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Create a block</h2>

        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
          <BlockTypes />

          <div className="opacity-20">
            {type === 'main' && (
              <div>
                <input
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
                </Tabs>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="label"
                className="text-sm font-medium text-stone-500 dark:text-stone-400"
              >
                Label
              </label>

              <Input
                id="label"
                name="label"
                type="text"
                placeholder="Label"
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

            {type === 'social' && <SocialPicker />}
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

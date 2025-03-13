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
import { updateBlock } from 'lib/actions';
import { cn, type BlockStyle } from 'lib/utils';
import { useModal } from './provider';

export default function UpdateBlockModal({
  block,
  fonts
}: {
  block: Block;
  fonts: Font[];
}) {
  const router = useRouter();
  const params = useParams();
  const modal = useModal();

  const [data, setData] = useState(block);
  const [logo, setLogo] = useState<string>('');

  const css = data.style as unknown as BlockStyle;

  return (
    <form
      action={async (data: FormData) =>
        updateBlock(data, params.id as Site['id'], block.id).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Update block', { id: block.id });

            router.refresh();
            modal?.hide();
            toast.success('Block updated!');
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Update the block</h2>

        {block.type === 'main' && (
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

          <input
            id="label"
            name="label"
            type="text"
            placeholder="Label"
            value={data.label ?? ''}
            onChange={e => setData({ ...data, label: e.target.value })}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
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
            {block.type === 'social' && (
              <div>
                <SocialIcon
                  href={data.href ?? ''}
                  network={logo}
                  fallback={{ color: '#000000', path: 'M0' }}
                  style={{ width: 28, height: 28 }}
                />
              </div>
            )}

            <input
              id="href"
              name="href"
              type="text"
              placeholder="https://instagram.com/..."
              value={data.href ?? ''}
              onChange={e => setData({ ...data, href: e.target.value })}
              required
              className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
            />
          </div>
        </div>

        {block.type === 'social' && (
          <SocialPicker onChange={logo => setLogo(logo)} value={logo} />
        )}
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <UpdateBlockFormButton />
      </div>
    </form>
  );
}

function UpdateBlockFormButton() {
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

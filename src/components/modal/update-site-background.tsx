'use client';

import type { Site } from '@prisma/client';
import va from '@vercel/analytics';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import * as backgrounds from 'components/editor/backgrounds';
import LoadingDots from 'components/icons/loading-dots';
import { useModal } from 'components/modal/provider';
import useTranslation from 'hooks/use-translation';
import { updateSite } from 'lib/actions';
import { cn } from 'lib/utils';

const $selected = atom<string | null>(null);

function BackgroundItem({
  children,
  name,
  preview = false
}: {
  children: React.ReactNode;
  name: string;
  preview?: boolean;
}) {
  const [selected, setSelected] = useAtom($selected);

  return (
    <div
      onClick={() => {
        setSelected(state => (state === name ? null : name));
      }}
      onKeyDown={() => {}}
      className={cn(
        'aspect-video w-full rounded-lg bg-white border-4 border-transparent',
        'relative overflow-hidden',
        {
          'border-4 border-black': selected === name && preview === false
        }
      )}
    >
      {children}
    </div>
  );
}

export default function UpdateSiteBackgroundModal({
  siteId
}: {
  siteId: Site['id'];
}) {
  const selected = useAtomValue($selected);

  const [pending, setPending] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null);

  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    setPending(true);

    const file = new FileReader();

    file.onloadend = () => {
      setMediaType(
        (acceptedFiles[0].type.split('/').at(0) as 'video' | 'image') ?? null
      );

      setPreview(file.result);
      setPending(false);
    };

    file.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { 'image/*': [], 'video/*': [] }
    });

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        if (form.get('css-background')?.toString().startsWith('component:')) {
          updateSite(form, siteId, 'css-background').then(res => {
            if ('error' in res) {
              toast.error(res.error);
            } else {
              va.track('Update site background', { id: siteId });

              router.refresh();
              modal?.hide();
              toast.success('Site background updated!');
            }
          });

          router.refresh();
          modal?.hide();
          toast.success('Site updated!');
        } else {
          if (acceptedFiles[0]) {
            setPending(true);

            try {
              const { url } = await fetch('/api/upload', {
                method: 'POST',
                body: JSON.stringify({
                  filename: acceptedFiles[0].name,
                  siteId,
                  attr: 'background'
                })
              }).then(res => res.json());

              await fetch(url, {
                method: 'PUT',
                body: acceptedFiles[0]
              });

              va.track('Update site', { id: siteId });

              router.refresh();
              modal?.hide();
              toast.success('Site updated!');
            } catch (error: unknown) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'An unknown error occurred'
              );
            } finally {
              setPending(false);
            }
          }
        }
      }}
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col p-5 md:p-10 gap-5">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.site.updateBackground.title')}
        </h2>

        <div className="flex flex-col gap-4">
          <div
            className={cn(
              'flex flex-col cursor-pointer transition-all p-4 border-2 border-dashed',
              'border-slate-500 rounded-md text-slate-400 hover:border-slate-900 hover:text-slate-900',
              isDragActive && 'border-slate-900 text-slate-900'
            )}
          >
            <div {...getRootProps()} className="text-center">
              <input {...getInputProps({ name: 'background' })} />

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

          {preview && (
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

          {selected && (
            <>
              <input
                type="hidden"
                name="css-background"
                value={`component:${selected}`}
              />

              <BackgroundItem preview name={selected}>
                {(() => {
                  const Background =
                    backgrounds[selected as keyof typeof backgrounds];

                  return <Background />;
                })()}
              </BackgroundItem>
            </>
          )}

          <div className="flex flex-col gap-2">
            <h2>Backgrounds Prédéfinis</h2>

            <div className="grid grid-cols-3 gap-2 max-h-[340px] overflow-y-auto">
              {Object.entries(backgrounds).map(([name, Background]) => (
                <BackgroundItem key={name} name={name}>
                  <Background />
                </BackgroundItem>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <UpdateSiteBackgroundFormButton pending={pending} />
      </div>
    </form>
  );
}

function UpdateSiteBackgroundFormButton({ pending = false }) {
  const translate = useTranslation();

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
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.site.updateBackground.button')}</p>
      )}
    </button>
  );
}

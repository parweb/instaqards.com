'use client';

import type { Site } from '@prisma/client';
import va from '@vercel/analytics';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { cn } from 'lib/utils';
import { useModal } from './provider';
import useTranslation from 'hooks/use-translation';

export default function UpdateSiteProfilePictureModal({
  siteId
}: {
  siteId: Site['id'];
}) {
  const translate = useTranslation();

  const [pending, setPending] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const router = useRouter();
  const modal = useModal();

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    setPending(true);

    const file = new FileReader();

    file.onloadend = () => {
      setPreview(file.result);
      setPending(false);
    };

    file.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop, multiple: false, accept: { 'image/*': [] } });

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();

        if (acceptedFiles[0]) {
          setPending(true);
          console.log({ acceptedFiles: acceptedFiles[0] });

          try {
            const { url } = await fetch('/api/upload', {
              method: 'POST',
              body: JSON.stringify({
                filename: acceptedFiles[0].name,
                siteId,
                attr: 'logo'
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
      }}
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col p-5 md:p-10 gap-5">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.site.updateProfilePicture.title')}
        </h2>

        <div
          className={cn(
            'flex flex-col cursor-pointer transition-all p-4 border-2 border-dashed',
            'border-slate-500 rounded-md text-slate-400 hover:border-slate-900 hover:text-slate-900',
            isDragActive && 'border-slate-900 text-slate-900'
          )}
        >
          <div {...getRootProps()} className="text-center">
            <input {...getInputProps({ name: 'logo' })} />

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
          <div className="relative w-full h-40">
            <Image
              className="aspect-video object-contain"
              src={preview as string}
              alt="Upload preview"
              fill
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <UpdateSiteProfilePictureFormButton pending={pending} />
      </div>
    </form>
  );
}

function UpdateSiteProfilePictureFormButton({ pending = false }) {
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
        <p>{translate('components.site.updateProfilePicture.button')}</p>
      )}
    </button>
  );
}

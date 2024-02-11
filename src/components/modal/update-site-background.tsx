'use client';

import { Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { updateSite } from 'lib/actions';
import { cn } from 'lib/utils';
import { useModal } from './provider';

export default function UpdateSiteBackgroundModal({
  siteId
}: {
  siteId: Site['id'];
}) {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null);

  const router = useRouter();
  const modal = useModal();

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = new FileReader();

    file.onloadend = function () {
      // @ts-ignore
      setMediaType(acceptedFiles[0].type.split('/').at(0));
      setPreview(file.result);
    };

    file.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    // @ts-ignore
    useDropzone({ onDrop, multiple: false, accept: 'image/*,video/*' });

  return (
    <form
      action={async () => {
        const formData = new FormData();

        if (acceptedFiles[0]) {
          formData.append('background', acceptedFiles[0]);
        }

        const res = await updateSite(formData, siteId, 'background');

        if (res.error) {
          toast.error(res.error);
        } else {
          va.track('Update site', { id: siteId });

          router.refresh();
          modal?.hide();
          toast.success(`Site updated!`);
        }
      }}
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col p-5 md:p-10 gap-5">
        <h2 className="font-cal text-2xl dark:text-white">Update Background</h2>

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
              </video>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <UpdateSiteBackgroundFormButton />
      </div>
    </form>
  );
}

function UpdateSiteBackgroundFormButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        'flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none',
        pending
          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
          : 'border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800'
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Update Background</p>}
    </button>
  );
}

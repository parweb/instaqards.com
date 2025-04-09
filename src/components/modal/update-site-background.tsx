'use client';

import type { Site } from '@prisma/client';
import va from '@vercel/analytics';
import { lookup } from 'mime-types';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import * as backgrounds from 'components/editor/backgrounds';
import LoadingDots from 'components/icons/loading-dots';
import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';
import { ColorPicker } from 'components/ui/color-picker';
import useTranslation from 'hooks/use-translation';
import { updateSite } from 'lib/actions';
import { cn } from 'lib/utils';

type BackgroundState =
  | {
      type: 'upload';
      file?: File;
      preview: string | null;
      mediaType: 'image' | 'video' | null;
    }
  | { type: 'predefined'; value: string | null }
  | { type: 'color'; value: string }
  | { type: null; value: null };

const BackgroundItem = ({
  children,
  name,
  preview = false,
  isSelected = false,
  onClick
}: {
  children: React.ReactNode;
  name: string;
  preview?: boolean;
  isSelected?: boolean;
  onClick: () => void;
}) => {
  const [expand, setExpand] = useState(false);

  return (
    <div
      onClick={() => {
        if (preview === false) {
          onClick();
        } else {
          setExpand(state => !state);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (preview === false) {
            onClick();
          } else {
            setExpand(state => !state);
          }
        }
      }}
      className={cn(
        'aspect-video w-full rounded-lg bg-white border-4 border-transparent',
        'relative overflow-hidden cursor-pointer',
        'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
        {
          'aspect-[5/1]': preview === true && expand === false,
          'border-black': isSelected && preview === false
        }
      )}
    >
      {children}
    </div>
  );
};

const UpdateSiteBackgroundModal = ({
  siteId,
  background
}: {
  siteId: Site['id'];
  background: Site['background'];
}) => {
  const getInitialState = (): BackgroundState => {
    if (background === null) {
      return { type: null, value: null };
    }

    if (background.startsWith('color:')) {
      return { type: 'color', value: background.replace('color:', '') };
    }

    if (background.startsWith('component:')) {
      return {
        type: 'predefined',
        value: background.replace('component:', '')
      };
    }

    const mimeType = lookup(background);
    const mediaType =
      background === null || mimeType === false
        ? null
        : mimeType.startsWith('image/')
          ? 'image'
          : 'video';

    return {
      type: 'upload',
      preview: background,
      mediaType: mediaType,
      file: undefined
    };
  };

  const [pending, setPending] = useState<boolean>(false);
  const [currentBackground, setCurrentBackground] =
    useState<BackgroundState>(getInitialState);

  const router = useRouter();
  const modal = useModal();
  const translate = useTranslation();

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    if (!acceptedFiles[0]) return;
    const droppedFile = acceptedFiles[0];
    setPending(true);
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      const mediaType =
        (droppedFile.type.split('/').at(0) as 'video' | 'image') ?? null;
      setCurrentBackground({
        type: 'upload',
        file: droppedFile,
        preview: fileReader.result as string,
        mediaType: mediaType
      });
      setPending(false);
    };

    fileReader.onerror = () => {
      toast.error('Failed to read file.');
      setPending(false);
    };

    fileReader.readAsDataURL(droppedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': [], 'video/*': [] }
  });

  const selectPredefinedBackground = (name: string) => {
    setCurrentBackground(prev => {
      if (prev.type === 'predefined' && prev.value === name) {
        return { type: null, value: null };
      }
      return { type: 'predefined', value: name };
    });
  };

  const handleColorChange = (color: string) => {
    setCurrentBackground({ type: 'color', value: color });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    if (currentBackground.type === 'predefined' && currentBackground.value) {
      setPending(true);
      form.set('css-background', `component:${currentBackground.value}`);
      updateSite(form, siteId, 'css-background')
        .then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Update site background', { id: siteId });
            router.refresh();
            modal?.hide();
            toast.success('Site background updated!');
          }
        })
        .finally(() => setPending(false));
    } else if (currentBackground.type === 'color') {
      setPending(true);
      form.set('css-background', `color:${currentBackground.value}`);
      updateSite(form, siteId, 'css-background')
        .then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Update site background', { id: siteId });
            router.refresh();
            modal?.hide();
            toast.success('Site background updated!');
          }
        })
        .finally(() => setPending(false));
    } else if (currentBackground.type === 'upload' && currentBackground.file) {
      setPending(true);
      try {
        const fileToUpload = currentBackground.file;
        const { url } = await fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({
            filename: fileToUpload.name,
            siteId,
            attr: 'background'
          })
        }).then(res => res.json());

        await fetch(url, {
          method: 'PUT',
          body: fileToUpload
        });

        va.track('Update site', { id: siteId });
        router.refresh();
        modal?.hide();
        toast.success('Site updated!');
      } catch (error: unknown) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unknown error occurred during upload'
        );
      } finally {
        setPending(false);
      }
    } else if (
      currentBackground.type === 'upload' &&
      !currentBackground.file &&
      currentBackground.preview
    ) {
      modal?.hide();
      toast.info('No changes detected for background.');
    } else {
      toast.info('Please select or upload a background.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:md:border-stone-700"
    >
      <div className="flex flex-col p-4 gap-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.site.updateBackground.title')}
        </h2>

        <div className="flex flex-col gap-4">
          <div
            className={cn(
              'flex flex-col cursor-pointer transition-all p-4 border-2 border-dashed',
              'border-slate-500 rounded-md text-slate-400 hover:border-slate-900 hover:text-slate-900',
              isDragActive && 'border-slate-900 text-slate-900',

              currentBackground.type === 'upload' &&
                'border-slate-900 text-slate-900'
            )}
          >
            <div {...getRootProps()} className="text-center">
              <input {...getInputProps({ name: 'background' })} />
              {isDragActive ? (
                <>
                  <p>Drop the file here</p>
                  <p>Image or Video</p>
                </>
              ) : (
                <>
                  <p>{"Drag 'n' drop a file here,"}</p>
                  <p>or click to select file</p>
                </>
              )}
            </div>
          </div>

          {currentBackground.type === 'upload' && currentBackground.preview && (
            <>
              {currentBackground.mediaType === 'image' && (
                <img
                  className="aspect-video object-contain rounded-md"
                  src={currentBackground.preview}
                  alt="Upload preview"
                />
              )}

              {currentBackground.mediaType === 'video' && (
                <video
                  className="aspect-video object-contain rounded-md"
                  controls
                >
                  <source src={currentBackground.preview} />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          )}

          {currentBackground.type === 'predefined' &&
            currentBackground.value && (
              <>
                <BackgroundItem
                  preview
                  name={currentBackground.value}
                  isSelected={false}
                  onClick={() => {}}
                >
                  {(() => {
                    const Background =
                      backgrounds[
                        currentBackground.value as keyof typeof backgrounds
                      ];

                    return Background ? (
                      <Background />
                    ) : (
                      <div>Preview unavailable</div>
                    );
                  })()}
                </BackgroundItem>
              </>
            )}

          {currentBackground.type === 'color' && (
            <>
              <div
                className="w-full aspect-video rounded-md border border-stone-200 dark:border-stone-700"
                style={{ backgroundColor: currentBackground.value }}
                title={`Selected color: ${currentBackground.value}`}
              />
            </>
          )}

          <div className="flex flex-col gap-2">
            <h2>Predefined Backgrounds</h2>
            <div className="max-h-[200px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(backgrounds).map(([name, Background]) => (
                  <BackgroundItem
                    key={name}
                    name={name}
                    isSelected={
                      currentBackground.type === 'predefined' &&
                      currentBackground.value === name
                    }
                    onClick={() => selectPredefinedBackground(name)}
                  >
                    <Background />
                  </BackgroundItem>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <hgroup className="flex items-center justify-between">
              <h2>Couleur Personnalisée</h2>
            </hgroup>

            <div className="flex flex-col gap-2">
              <ColorPicker
                className="aspect-auto w-full"
                name="color"
                value={
                  currentBackground.type === 'color'
                    ? currentBackground.value
                    : '#000000ff'
                }
                onChange={handleColorChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <UpdateSiteBackgroundFormButton pending={pending} />
      </div>
    </form>
  );
};

const UpdateSiteBackgroundFormButton = ({ pending = false }) => {
  const translate = useTranslation();

  return (
    <Button type="submit" className={cn('w-full')} disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.site.updateBackground.button')}</p>
      )}
    </Button>
  );
};

export default UpdateSiteBackgroundModal;

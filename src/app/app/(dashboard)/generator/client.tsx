'use client';

import type { Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useRef, useState } from 'react';
import { LuArrowUpRight, LuLoader } from 'react-icons/lu';
import { useDebouncedCallback } from 'use-debounce';

import { BlockTypesItem } from 'components/editor/form/BlockTypesItem';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { uri } from 'settings';
import { generateSite } from './action';

export function Fields({
  site
}: {
  site: Prisma.SiteGetPayload<{ include: { blocks: true } }> | null;
}) {
  const [refreshInputs, setRefreshInputs] = useState(false);

  const submit = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const [button, setButton] = useState<
    { type: string; id: string } | undefined
    // @ts-ignore
  >(() =>
    site
      ? // @ts-ignore
        site?.blocks?.at?.(0)?.widget
      : undefined
  );

  const [links, setLinks] = useState<string | undefined>(() =>
    site
      ? site.blocks
          // @ts-ignore
          .map(item => item?.widget?.data ?? item)
          // @ts-ignore
          .map(data =>
            [
              data?.label,
              data?.href
                ?.replace('https://', '')
                ?.replace('www.', '')
                ?.replace(/\/$/, '')
            ]
              .filter(Boolean)
              .join(' | ')
          )
          .filter(Boolean)
          .join('\n')
      : undefined
  );

  const [name, setName] = useState<string | undefined>(
    () => site?.name || undefined
  );

  const [description, setDescription] = useState<string | undefined>(
    () => site?.description || undefined
  );

  const debouncedSubmit = useDebouncedCallback(() => {
    submit.current?.click();
  }, 1000);

  useEffect(() => {
    if (refreshInputs === false) return;

    setButton(
      // @ts-ignore
      site
        ? // @ts-ignore
          site?.blocks?.at?.(0)?.widget
        : undefined
    );

    setLinks(
      site
        ? site.blocks
            // @ts-ignore
            .map(item => item?.widget?.data ?? item)
            // @ts-ignore
            .map(data =>
              [
                data?.label,
                data?.href
                  .replace('https://', '')
                  .replace('www.', '')
                  .replace(/\/$/, '')
              ]
                .filter(Boolean)
                .join(' | ')
            )
            .filter(Boolean)
            .join('\n')
        : undefined
    );

    setName(site?.name || undefined);

    setDescription(site?.description || undefined);

    setRefreshInputs(false);
  }, [refreshInputs, site]);

  return (
    <>
      <div>
        <a
          target={site ? '_blank' : undefined}
          rel="noreferrer"
          className="truncate rounded-md bg-green-400 p-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 inline-flex items-center gap-2 content empty:hidden"
          href={uri.site(site).link}
        >
          {uri.site(site).title}

          {debouncedSubmit.isPending() ? (
            <LuLoader className="animate-spin" />
          ) : (
            site && <LuArrowUpRight />
          )}
        </a>
      </div>

      <form
        action={form =>
          startTransition(() =>
            generateSite(form).then(data => {
              router.refresh();

              // setRefreshInputs(true);

              setButton(
                // @ts-ignore
                data
                  ? // @ts-ignore
                    data?.blocks?.at?.(0)?.widget
                  : undefined
              );

              setLinks(
                data
                  ? data.blocks
                      // @ts-ignore
                      .map(item => item?.widget?.data ?? item)
                      // @ts-ignore
                      .map(data =>
                        [
                          data?.label,
                          data?.href
                            ?.replace('https://', '')
                            ?.replace('www.', '')
                            ?.replace(/\/$/, '')
                        ]
                          .filter(Boolean)
                          .join(' | ')
                      )
                      .filter(Boolean)
                      .join('\n')
                  : undefined
              );

              setName(data?.name || undefined);

              setDescription(data?.description || undefined);
            })
          )
        }
        className="flex flex-col gap-4"
        style={{ touchAction: 'pan-y' }}
      >
        <input type="hidden" name="siteId" value={site?.id} />

        {button && (
          <input type="hidden" name="button" value={JSON.stringify(button)} />
        )}

        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={e => {
            setName(e.target.value);
            debouncedSubmit();
          }}
        />

        <AutosizeTextarea
          name="description"
          placeholder="Description"
          value={description}
          onChange={e => {
            setDescription(e.target.value);
            debouncedSubmit();
          }}
        />

        {/* <Uploader name="image" defaultValue={null} /> */}

        <AutosizeTextarea
          minHeight={80}
          name="links"
          placeholder={`https://instagram.com/...
https://facebook.com/...
https://tiktok.com/...
https://youtube.com/...
...
        `}
          value={links}
          onChange={e => {
            setLinks(e.target.value);
            debouncedSubmit();
          }}
        />

        {links && (
          <BlockTypesItem
            {...{ type: 'button', label: 'Boutons', index: 0 }}
            onClick={data => {
              setButton(data);
              debouncedSubmit();
            }}
            value={button}
          />
        )}

        <button className="hidden" type="submit" ref={submit}>
          Create
        </button>
      </form>
    </>
  );
}

export function ButtonSubmit() {
  return <Button type="submit">Create</Button>;
}

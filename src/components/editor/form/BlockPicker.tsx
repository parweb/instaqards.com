'use client';

import type { Block } from '@prisma/client';
import type { Dispatch, SetStateAction } from 'react';
import { SocialIcon } from 'react-social-icons';

import { BlockTypes } from 'components/editor/form/BlockTypes';
import { Input } from 'components/ui/input';
import { SocialPicker } from 'components/ui/social-picker';
import type { BlockStyle } from 'lib/utils';

export function BlockPicker({
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
}) {
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
}

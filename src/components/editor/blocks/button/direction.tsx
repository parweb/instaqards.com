import type { Block } from '@prisma/client';
import Link from 'next/link';
import * as z from 'zod';

import { cn, json } from 'lib/utils';
import { FaDirections } from 'react-icons/fa';

const $label = z
  .string()
  .min(1, 'Label is required')
  .describe(
    json({
      label: 'Label',
      kind: 'string'
    })
  );

const $address = z
  .string()
  .min(1, 'Address is required')
  .describe(
    json({
      label: 'Address',
      kind: 'string'
    })
  );

const BaseButtonProps = z.object({ label: $label, address: $address });
export const input = z.object({ label: $label, address: $address });

const BaseButton: React.FC<
  Partial<z.infer<typeof BaseButtonProps>> & { className?: string }
> = ({ label, address, className }) => {
  return (
    <button
      className={cn(
        className,
        'group flex items-center p-4 gap-4 border-2 border-stone-200 rounded-md bg-white',
        'hover:border-stone-400'
      )}
      type="button"
    >
      <div className="flex gap-4">
        <div>
          <FaDirections className="text-stone-400 w-14 h-14 group-hover:text-stone-600" />
        </div>
        <div className="flex-1 flex flex-col gap-1 items-start">
          <span className="text-md font-medium">{label}</span>
          <span className="text-sm text-stone-500">{address}</span>
        </div>
      </div>

      <style jsx>{`
        button {
        }
      `}</style>
    </button>
  );
};

export default function Direction({
  label = 'Nom du lieu',
  address = 'Adresse du lieu',
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  const href = `https://www.google.com/maps/place/${encodeURIComponent(address)}/`;

  if (href) {
    return (
      <Link
        className="w-full"
        href={block ? `/click/${block.id}` : href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <BaseButton className="w-full" label={label} address={address} />
      </Link>
    );
  }

  return <BaseButton className="w-full" label={label} address={address} />;
}

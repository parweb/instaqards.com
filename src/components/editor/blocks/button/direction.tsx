import type { Block } from '@prisma/client';
import Link from 'next/link';
import { FaDirections } from 'react-icons/fa';
import * as z from 'zod';

import { cn, json } from 'lib/utils';

export const input = z.object({
  label: z.string().describe(
    json({
      label: 'Label',
      kind: 'string'
    })
  ),

  address: z
    .object({
      address: z.object({
        house_number: z.string().optional(),
        road: z.string().optional(),
        postcode: z.string(),
        municipality: z.string().optional()
      })
    })
    .describe(
      json({
        label: 'Address',
        kind: 'address',
        placeholder: 'Entrez une adresse'
      })
    )
});

const BaseButton: React.FC<
  Partial<z.infer<typeof input>> & { className?: string }
> = ({
  label,
  address = {
    address: {
      house_number: '',
      road: '',
      postcode: '',
      municipality: ''
    }
  },
  className
}) => {
  const display_name = [
    address.address.house_number,
    address.address.road,
    address.address.postcode,
    address.address.municipality
  ]
    .filter(Boolean)
    .join(' ');

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
          {label && <span className="text-md font-bold text-xl">{label}</span>}

          {address && (
            <span className="text-sm text-stone-500 text-left">
              {display_name}
            </span>
          )}
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
  address = {
    address: { house_number: '', road: '', postcode: '', municipality: '' }
  },
  block
}: Partial<z.infer<typeof input>> & { block?: Block }) {
  const display_name = [
    address.address.house_number,
    address.address.road,
    address.address.postcode,
    address.address.municipality
  ]
    .filter(Boolean)
    .join(' ');

  const href = `https://www.google.com/maps/place/${encodeURIComponent(
    display_name
  )}/`;

  if (href) {
    return (
      <Link
        prefetch={false}
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

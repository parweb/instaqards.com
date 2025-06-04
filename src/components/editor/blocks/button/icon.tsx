import type { Block } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { cn, json } from 'lib/utils';

const $label = z
  .string()
  .min(1, 'Label is required')
  .describe(
    json({
      label: 'Label',
      kind: 'string'
    })
  );

const $href = z.string().describe(
  json({
    label: 'Link',
    kind: 'link'
  })
);

const $background = z
  .string()
  .min(1, 'Background is required')
  .describe(
    json({
      label: 'Background',
      kind: 'color',
      default: '#A1A1A1'
    })
  );

const $color = z
  .string()
  .min(1, 'Color is required')
  .describe(
    json({
      label: 'Color',
      kind: 'color',
      default: '#ffff'
    })
  );

const $image = z
  .array(
    z
      .object({
        id: z.string(),
        link: z.string().optional()
      })
      .and(
        z
          .object({
            kind: z.literal('remote'),
            url: z.string()
          })
          .or(
            z.object({
              kind: z.literal('local'),
              file: z.instanceof(File)
            })
          )
      )
  )

  .describe(
    json({
      label: 'Image',
      kind: 'upload',
      multiple: false,
      preview: false,
      linkable: false,
      accept: { 'image/*': [] }
    })
  );

const BaseButtonProps = z.object({
  images: $image,
  label: $label,
  background: $background,
  color: $color
});

export const input = z.object({
  images: $image,
  label: $label,
  href: $href,
  background: $background,
  color: $color
});

const placeholder = 'https://placehold.co/96x96.png';
const BaseButton: React.FC<
  Partial<z.infer<typeof BaseButtonProps>> & { className?: string }
> = ({
  label,
  images: [image] = [{ id: '1', kind: 'remote', url: placeholder }],
  background = '#A1A1A1',
  color = '#ffff',
  className
}) => {
  const [src, setSrc] = useState<string>(
    image.kind === 'remote' ? image.url : ''
  );

  const imageFile = image.kind === 'local' ? image.file : null;
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setSrc(reader.result?.toString() ?? '');
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  return (
    <button type="button" className={cn(className, 'rounded-md')}>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={image.id}
          className="aspect-square w-14 rounded-md"
        />
      </div>

      <div className="flex-1">{label}</div>

      <style jsx>{`
        button {
          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0.5rem;

          background: ${background};
          color: ${color};
        }
      `}</style>
    </button>
  );
};

export default function Icon(
  props: Partial<z.infer<typeof input>> & { block?: Block }
) {
  if (props.href) {
    return (
      <Link
        prefetch={false}
        className="w-full"
        href={props.block ? `/click/${props.block.id}` : props.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <BaseButton className="w-full" {...props} />
      </Link>
    );
  }

  return <BaseButton className="w-full" {...props} />;
}

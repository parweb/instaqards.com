import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  text: z
    .string()
    .min(1, 'Text is required')
    .describe(json({ label: 'Text', kind: 'string' })),

  font: z
    .object({
      color: z.string(),
      fontSize: z.string(),
      fontFamily: z.string(),
      textAlign: z.enum(['left', 'center', 'right', 'justify'])
    })
    .describe(
      json({
        label: 'Font',
        kind: 'font',
        default: {
          color: '#ffff',
          fontSize: '16px',
          fontFamily: 'Inter',
          textAlign: 'center'
        }
      })
    ),
  container: z
    .object({
      backgroundColor: z.string(),
      borderColor: z.string(),
      borderWidth: z.string(),
      borderRadius: z.string(),
      padding: z.string(),
      margin: z.string()
    })
    .describe(
      json({
        label: 'Box',
        kind: 'container',
        default: {
          backgroundColor: '#ffff',
          borderColor: '#ffff',
          borderWidth: '1px',
          borderRadius: '0px',
          padding: '0px',
          margin: '0px'
        }
      })
    )
});

export default function Normal({
  text = 'Normal text',
  font = {
    color: '#000f',
    fontSize: '16px',
    fontFamily: 'Inter',
    textAlign: 'center'
  },
  container = {
    backgroundColor: '#ffff',
    borderColor: '#000f',
    borderWidth: '1px',
    borderRadius: '0px',
    padding: '0px',
    margin: '0px'
  }
}: Partial<z.infer<typeof input>>) {
  return (
    <div
      className="flex-1"
      style={{
        color: font.color,
        fontSize: font.fontSize,
        fontFamily: font.fontFamily,
        textAlign: font.textAlign,

        backgroundColor: container.backgroundColor,
        borderColor: container.borderColor,
        borderWidth: container.borderWidth,
        borderRadius: container.borderRadius,
        padding: container.padding,
        margin: container.margin
      }}
    >
      {text}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?${[font.fontFamily]
          .map(font => `family=${font.replaceAll(' ', '+')}&display=swap`)
          .join('&')}&display=swap');
      `}</style>
    </div>
  );
}

export function Editor() {
  return null;
}

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

export default function Gradiant({
  text = 'Gradiant text',
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
      <div>
        {text}

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?${[font.fontFamily]
            .map(font => `family=${font.replaceAll(' ', '+')}&display=swap`)
            .join('&')}&display=swap');

          @property --＠color-1 {
            syntax: '<color>';
            inherits: false;
            initial-value: hsl(98 100% 62%);
          }

          @property --＠color-2 {
            syntax: '<color>';
            inherits: false;
            initial-value: hsl(204 100% 59%);
          }

          @keyframes gradient-change {
            to {
              --＠color-1: hsl(210 100% 59%);
              --＠color-2: hsl(310 100% 59%);
            }
          }

          div {
            animation: gradient-change 2s linear infinite alternate;

            background: linear-gradient(
              to right in oklch,
              var(--＠color-1),
              var(--＠color-2)
            );

            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;

            background-clip: text;
            color: transparent;
          }
        `}</style>
      </div>
    </div>
  );
}

export function Editor() {
  return null;
}

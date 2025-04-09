'use client';

import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Post URL', kind: 'string' }))
});

export default function Snapchat({
  url = 'https://www.snapchat.com/spotlight/W7_EDlXWTBiXAEEniNoMPwAAYdmNtb3VwcnJuAZWzQBdaAZWzQBdEAAAAAQ'
}: Partial<z.infer<typeof input>>) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <blockquote
          data-snapchat-embed-width="416"
          data-snapchat-embed-height="692"
          data-snapchat-embed-url={`${url}/embed`}
          data-snapchat-embed-style="border-radius: 40px;"
          data-snapchat-embed-title="@oj.fit's Sound"
          className="snapchat-embed mx-auto flex flex-col items-center justify-center rounded-40 border-0 bg-gray-200 p-0 text-center text-black shadow-[0_0_1px_0_rgba(0,0,0,0.5),0_1px_10px_0_rgba(0,0,0,0.15)]"
        >
          <div className="flex flex-row items-center">
            <a
              title="@oj.fit's Sound"
              href={url}
              className="flex-2/4 flex-grow-0 h-10 w-10 cursor-pointer rounded-full bg-gray-200"
            ></a>

            <div className="flex flex-grow-1 flex-col items-center justify-center" />
          </div>

          <div className="flex-1" />

          <div className="flex flex-row items-center border-end-end-radius-40 border-end-start-radius-40">
            <a
              title="@oj.fit's Sound"
              href={url}
              className="flex flex-row items-center justify-center rounded-inherit border-none bg-yellow-500 px-20 py-2 text-center text-decoration-none text-black"
            >
              View more on Snapchat
            </a>
          </div>
        </blockquote>
      </div>

      <script async src="https://www.snapchat.com/embed.js"></script>
    </>
  );
}

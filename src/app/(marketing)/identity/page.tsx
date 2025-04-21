'use cache';

import Image from 'next/image';

import { cn } from 'lib/utils';
import { boldonse } from 'styles/fonts';
import { DownloadButton } from './client';

export default async function Identity() {
  return (
    <div className="p-10 flex flex-col gap-10 max-w-screen-lg mx-auto">
      <div className="flex flex-col gap-4">
        <h1
          className={cn('text-5xl font-bold text-center', boldonse.className)}
        >
          Identity
        </h1>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h2 className={cn('text-xl font-bold', boldonse.className)}>
            SQUARE
          </h2>

          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-2">
              <div
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Identity"
                  width={400}
                  height={400}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className={boldonse.className}>Black</div>
                <DownloadButton src="/logo.png" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <Image
                  src="/Q_Transparent.png"
                  alt="Identity"
                  width={400}
                  height={400}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className={boldonse.className}>White</div>
                <DownloadButton src="/Q_Transparent.png" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className={cn('text-xl font-bold', boldonse.className)}>FULL</h2>

          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-2">
              <div
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <Image
                  src="/rsz_black-transparent_nolink.png"
                  alt="Identity"
                  width={400}
                  height={400}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className={boldonse.className}>Black</div>
                <DownloadButton src="/rsz_black-transparent_nolink.png" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <Image
                  src="/rsz_transparent_nolink.png"
                  alt="Identity"
                  width={400}
                  height={400}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className={boldonse.className}>White</div>
                <DownloadButton src="/rsz_transparent_nolink.png" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className={cn('text-xl font-bold', boldonse.className)}>
            FULL WITH LINK
          </h2>

          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-2">
              <div
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <Image
                  src="/rsz_black-transparent_withlink.png"
                  alt="Identity"
                  width={400}
                  height={400}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className={boldonse.className}>Black</div>
                <DownloadButton src="/rsz_black-transparent_withlink.png" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <Image
                  src="/rsz_transparent_withlink.png"
                  alt="Identity"
                  width={400}
                  height={400}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className={boldonse.className}>White</div>
                <DownloadButton src="/rsz_transparent_withlink.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

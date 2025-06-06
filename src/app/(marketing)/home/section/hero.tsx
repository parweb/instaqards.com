import { LuCircleCheck } from 'react-icons/lu';

import { translate } from 'helpers/translate';
import { cn } from 'lib/utils';
import { Begin } from './begin';
import { Iphone } from './iphone';

export const Hero = async ({ bg = '06' }) => {
  return (
    <div
      id="Hero"
      className="relative flex flex-col items-center justify-center overflow-hidden bg-[#ddd] p-5 sm:p-20"
    >
      <video
        className="absolute top-0 right-0 left-0 h-full w-full object-cover"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={`/api/file?id=landing-background-video-${bg}.mp4`}
          type="video/mp4"
        />
      </video>

      <div className="z-10">
        <div className="flex max-w-[900px] flex-col items-center gap-10 md:flex-row">
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-5 rounded-md p-4 text-white">
              <div className={cn('b text-4xl font-[900] sm:text-7xl')}>
                {await translate('page.home.hero.title')}
              </div>

              <div className="text-2xl">
                {await translate('page.home.hero.description')}
              </div>

              <ul className="">
                <li className="flex gap-2">
                  <LuCircleCheck />

                  <span>{await translate('page.home.hero.bullet.one')}</span>
                </li>

                <li className="flex gap-2">
                  <LuCircleCheck />

                  <span>{await translate('page.home.hero.bullet.two')}</span>
                </li>

                <li className="flex gap-2">
                  <LuCircleCheck />

                  <span>{await translate('page.home.hero.bullet.three')}</span>
                </li>
              </ul>

              <div className="max-w-sm rounded-md bg-white p-4 text-black shadow-md">
                <Begin />
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <Iphone url="https://gellyx.qards.link/" scale={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

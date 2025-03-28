import { LuCheck } from 'react-icons/lu';

import { translate } from 'helpers/translate';
import { cn } from 'lib/utils';
import { Begin } from './begin';
import { Iphone } from './iphone';

export const Hero = async ({ bg = '06' }) => {
  return (
    <div
      id="Hero"
      className="relative flex flex-col bg-[#ddd] p-5 sm:p-20 items-center justify-center overflow-hidden"
    >
      <video
        className="absolute top-0 right-0 left-0 object-cover w-full h-full"
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
        <div className="flex gap-10 max-w-[900px] items-center flex-col md:flex-row">
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-5 text-white p-4 rounded-md">
              <div className={cn('text-4xl sm:text-7xl font-[900] b')}>
                {await translate('page.home.hero.title')}
              </div>

              <div className="text-2xl">
                {await translate('page.home.hero.description')}
              </div>

              <ul className="">
                <li className="flex gap-2">
                  <LuCheck />

                  <span>{await translate('page.home.hero.bullet.one')}</span>
                </li>

                <li className="flex gap-2">
                  <LuCheck />

                  <span>{await translate('page.home.hero.bullet.two')}</span>
                </li>

                <li className="flex gap-2">
                  <LuCheck />

                  <span>{await translate('page.home.hero.bullet.three')}</span>
                </li>
              </ul>

              <div className="bg-white rounded-md p-4 text-black max-w-sm shadow-md">
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

import { translate } from 'helpers/translate';

export const Features = () => {
  return (
    <div id="Features" className="flex flex-col p-10 gap-10">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-4xl sm:text-5xl font-[900]">
          {translate('page.home.features.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {translate('page.home.features.description')}
        </p>
      </hgroup>

      <div className="">
        <p>{translate('page.home.features.bullet.one')}</p>
        <p>{translate('page.home.features.bullet.two')}</p>
        <p>{translate('page.home.features.bullet.three')}</p>
        <p>{translate('page.home.features.bullet.four')}</p>
        <p>{translate('page.home.features.bullet.five')}</p>
      </div>
    </div>
  );
};

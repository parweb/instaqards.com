import { translate } from 'helpers/translate';

export const Features = async () => {
  return (
    <div id="Features" className="flex flex-col p-10 gap-10">
      <hgroup className="text-center flex flex-col gap-4">
        <h2 className="text-4xl sm:text-5xl font-[900]">
          {await translate('page.home.features.title')}
        </h2>
        <p className="text-gray-600 text-2xl">
          {await translate('page.home.features.description')}
        </p>
      </hgroup>

      <div className="">
        <p>{await translate('page.home.features.bullet.one')}</p>
        <p>{await translate('page.home.features.bullet.two')}</p>
        <p>{await translate('page.home.features.bullet.three')}</p>
        <p>{await translate('page.home.features.bullet.four')}</p>
        <p>{await translate('page.home.features.bullet.five')}</p>
      </div>
    </div>
  );
};

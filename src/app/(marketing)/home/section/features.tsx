import { translate } from 'helpers/translate';

export const Features = async () => {
  return (
    <div id="Features" className="flex flex-col gap-10 p-10">
      <hgroup className="flex flex-col gap-4 text-center">
        <h2 className="text-4xl font-[900] sm:text-5xl">
          {await translate('page.home.features.title')}
        </h2>
        <p className="text-2xl text-gray-600">
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

import { translate } from 'helpers/translate';

export default async function HelpPage() {
  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {await translate('dashboard.help.title')}
          </h1>
        </div>

        <div>
          <div>{await translate('dashboard.help.description')}</div>

          <a href="tel:+1-303-499-7111" className="underline">
            +1-303-499-7111
          </a>
        </div>
      </div>
    </div>
  );
}

import { redirect } from 'next/navigation';

import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';
import { CreateButton } from './create/CreateButton';
import { CreateModal } from './create/CreateModal';
import { LinkCard } from './LinkCard';

export default async function AllLinks() {
  const session = await getSession();

  if (!session || !session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col">
        <hgroup className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold">
            {translate('dashboard.links.title')}
          </h1>

          <CreateButton label={translate('dashboard.links.create')}>
            <CreateModal />
          </CreateButton>
        </hgroup>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            id: '1',
            name: 'Google',
            description: 'Google is a search engine',
            url: 'https://google.com'
          },
          {
            id: '2',
            name: 'Facebook',
            description: 'Facebook is a social media platform',
            url: 'https://facebook.com'
          },
          {
            id: '3',
            name: 'Twitter',
            description: 'Twitter is a social media platform',
            url: 'https://twitter.com'
          },
          {
            id: '4',
            name: 'Instagram',
            description: 'Instagram is a social media platform',
            url: 'https://instagram.com'
          }
        ].map(link => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}

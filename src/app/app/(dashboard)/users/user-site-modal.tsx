import { Prisma } from '@prisma/client';
import Link from 'next/link';

import { Badge } from 'components/ui/badge';
import { uri } from 'settings';

export default function UserSiteModal({
  user
}: {
  user: Prisma.UserGetPayload<{
    include: { sites: true };
  }>;
}) {
  return (
    <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 py-4">
      <hgroup className="flex items-center gap-2">
        <Badge>{user.sites.length}</Badge>
        <h2 className="text-lg font-medium">Sites</h2>
      </hgroup>

      {user.sites.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun site</p>
      ) : (
        <div className="grid max-h-[500px] gap-4 overflow-y-auto">
          {user.sites.map(site => {
            return (
              <div
                key={site.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8">
                    <img
                      src={
                        site.logo ||
                        'https://qards.link/rsz_noir-fon-transparent.png'
                      }
                      alt={site.name || ''}
                      className="h-full w-full rounded object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{site.name || 'Sans nom'}</h3>
                    <p className="truncate text-sm text-gray-500">
                      <Link
                        href={uri.site(site).link}
                        target="_blank"
                        className="hover:underline"
                      >
                        {uri.site(site).title}
                      </Link>
                    </p>
                  </div>
                </div>

                <Link
                  prefetch
                  href={`/site/${site.id}`}
                  target="_blank"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

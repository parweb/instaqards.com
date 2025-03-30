import { Prisma } from '@prisma/client';
import { Badge } from 'components/ui/badge';
import Link from 'next/link';

export default function UserSiteModal({
  user
}: {
  user: Prisma.UserGetPayload<{
    include: { sites: true };
  }>;
}) {
  return (
    <div className="grid gap-4 py-4 bg-white rounded-lg p-4 border border-gray-200">
      <hgroup className="flex items-center gap-2">
        <Badge>{user.sites.length}</Badge>
        <h2 className="text-lg font-medium">Sites</h2>
      </hgroup>

      {user.sites.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun site</p>
      ) : (
        <div className="grid gap-4 max-h-[500px] overflow-y-auto">
          {user.sites.map(site => {
            const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

            return (
              <div
                key={site.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8">
                    <img
                      src={
                        site.logo ||
                        'https://qards.link/rsz_noir-fon-transparent.png'
                      }
                      alt={site.name || ''}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{site.name || 'Sans nom'}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      <Link
                        href={
                          process.env.NEXT_PUBLIC_VERCEL_ENV
                            ? `https://${url}`
                            : `http://${site.subdomain}.localhost:11000`
                        }
                        target="_blank"
                        className="hover:underline"
                      >
                        {process.env.NEXT_PUBLIC_VERCEL_ENV
                          ? `https://${url}`
                          : `http://${site.subdomain}.localhost:11000`}
                      </Link>
                    </p>
                  </div>
                </div>

                <Link
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

'use client';

import type { Prisma } from '@prisma/client';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { Switch } from 'components/ui/switch';
import { Subscription } from 'lib/Subscription';
import Link from 'next/link';
import UserSiteModal from './user-site-modal';
import UserSiteModalButton from './user-site-modal-button';

interface UsersTableProps {
  affiliate?: boolean;
  initialUsers: Prisma.UserGetPayload<{
    include: {
      sites: true;
      subscriptions: {
        include: { price: { include: { product: true } } };
      };
    };
  }>[];
}

export const UsersTable = ({
  initialUsers,
  affiliate = false
}: UsersTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hideNoSites, setHideNoSites] = useState(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');

  const filteredUsers = initialUsers.filter(user => {
    const searchMatch =
      searchQuery === '' ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const siteMatch = !hideNoSites || user.sites.length > 0;

    let subscriptionMatch = true;
    if (subscriptionFilter !== 'all') {
      subscriptionMatch = user.subscriptions[0]?.status === subscriptionFilter;
    }

    return searchMatch && siteMatch && subscriptionMatch;
  });

  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Statut de subscription</Label>
            <RadioGroup
              value={subscriptionFilter}
              onValueChange={setSubscriptionFilter}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Tous</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Actif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trialing" id="trialing" />
                <Label htmlFor="trialing">Trial</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="hide-no-sites"
              checked={hideNoSites}
              onCheckedChange={setHideNoSites}
            />
            <Label htmlFor="hide-no-sites">
              Masquer les utilisateurs sans site
            </Label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Utilisateur
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sites
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subscription
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => {
                const avatar =
                  user.image ?? `https://avatar.vercel.sh/${user.email}`;

                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Link
                            href={`${affiliate === true ? '/affiliation' : ''}/user/${user.id}`}
                          >
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage
                                src={avatar}
                                alt={user?.name ?? ''}
                              />
                              <AvatarFallback className="rounded-lg">
                                {(
                                  user.name?.[0] || user.email[0]
                                ).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        </div>

                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              href={`${affiliate === true ? '/affiliation' : ''}/user/${user.id}`}
                            >
                              {user.name}
                            </Link>
                          </div>

                          <div className="text-sm text-gray-500">
                            <Link
                              href={`${affiliate === true ? '/affiliation' : ''}/user/${user.id}`}
                            >
                              {user.email}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <UserSiteModalButton label={`${user.sites.length} sites`}>
                        <UserSiteModal user={user} />
                      </UserSiteModalButton>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.subscriptions.length ? (
                        user.subscriptions.slice(0, 1).map(subscription => {
                          const sub = new Subscription(subscription, user);

                          return (
                            <span
                              key={subscription.id}
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                sub.valid()
                                  ? 'bg-green-100 text-green-800'
                                  : sub.onTrial()
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {sub.valid()
                                ? 'active'
                                : sub.onTrial()
                                  ? 'trial'
                                  : 'inactive'}
                            </span>
                          );
                        })
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          None
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

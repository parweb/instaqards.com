'use client';

import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState
} from 'nuqs';

import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { Switch } from 'components/ui/switch';
import { clamp } from 'helpers/clamp';
import { Subscription } from 'lib/Subscription';
import UserSiteModal from './user-site-modal';
import UserSiteModalButton from './user-site-modal-button';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from 'components/ui/pagination';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

const Pages = ({ total }: { total: number }) => {
  const router = useRouter();

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [take, setTake] = useQueryState('take', parseAsInteger.withDefault(25));

  if (!total) return null;

  const pages = Math.ceil(total / take);

  return (
    <div className="flex items-center justify-between gap-4">
      <Pagination>
        <PaginationContent className="flex gap-4">
          <PaginationItem>
            <PaginationPrevious
              onClick={async () => {
                await setPage(clamp(page - 1, 1, pages));
                router.refresh();
              }}
            />
          </PaginationItem>

          <PaginationItem className="flex items-center gap-2">
            <Input
              type="number"
              value={page}
              min={1}
              max={pages}
              step={1}
              onChange={async e => {
                await setPage(Number(e.target.value));
                router.refresh();
              }}
            />

            <span>/</span>

            <span>{pages}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={async () => {
                await setPage(clamp(page + 1, 1, pages));
                router.refresh();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Select
        value={take.toString()}
        onValueChange={async value => {
          await setTake(Number(value));
          router.refresh();
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Résultats" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

interface UsersTableProps {
  affiliate?: boolean;
  users: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      image: true;
      sites: true;
      createdAt: true;
      subscriptions: {
        select: {
          id: true;
          status: true;
          trial_end: true;
          trial_start: true;
          ended_at: true;
        };
      };
    };
  }>[];
  total?: number;
}

export const UsersTable = ({
  users,
  affiliate = false,
  total
}: UsersTableProps) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );
  const [hideNoSites, setHideNoSites] = useQueryState(
    'withSite',
    parseAsBoolean.withDefault(false)
  );
  const [subscriptionFilter, setSubscriptionFilter] = useQueryState(
    'subscription',
    parseAsStringEnum(['all', 'active', 'trialing']).withDefault('all')
  );

  // const filteredUsers = initialUsers.filter(user => {
  //   const searchMatch =
  //     searchQuery === '' ||
  //     user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchQuery.toLowerCase());

  //   const siteMatch = !hideNoSites || user.sites.length > 0;

  //   let subscriptionMatch = true;
  //   if (subscriptionFilter !== 'all') {
  //     subscriptionMatch = user.subscriptions[0]?.status === subscriptionFilter;
  //   }

  //   return searchMatch && siteMatch && subscriptionMatch;
  // });

  return (
    <>
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Rechercher</Label>

            <Input
              id="search"
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={async e => {
                await setSearchQuery(e.target.value);
                router.refresh();
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Statut de subscription</Label>
            <RadioGroup
              value={subscriptionFilter}
              onValueChange={async value => {
                await setSubscriptionFilter(
                  value as 'all' | 'active' | 'trialing'
                );
                router.refresh();
              }}
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
              onCheckedChange={async value => {
                await setHideNoSites(value);
                router.refresh();
              }}
            />
            <Label htmlFor="hide-no-sites">
              Masquer les utilisateurs sans site
            </Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {!!total && total !== users.length && <Pages total={total} />}

        <div className="flex flex-col gap-4 rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Utilisateur
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Sites
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Subscription
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map(user => {
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
                        <UserSiteModalButton
                          label={`${user.sites.length} sites`}
                        >
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
                                className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
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
                          <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs leading-5 font-semibold text-gray-800">
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

        {!!total && total !== users.length && <Pages total={total} />}
      </div>
    </>
  );
};

import { UserRole } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LuArrowLeft } from 'react-icons/lu';

import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';
import { Separator } from 'components/ui/separator';
import { db } from 'helpers/db';

export default async function UserPage(props: {
  params: Promise<{ userId: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const userId = params.userId;

  if (!userId) {
    notFound();
  }

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    include: {
      accounts: true,
      sessions: { orderBy: { expires: 'desc' } },
      sites: { orderBy: { createdAt: 'desc' } },
      subscriptions: {
        include: {
          price: {
            include: {
              product: true
            }
          }
        },
        orderBy: { created: 'desc' }
      },
      Authenticator: true,
      links: { orderBy: { createdAt: 'desc' } },
      customer: true,
      twoFactorConfirmation: true,
      feedback: { orderBy: { createdAt: 'desc' } },
      likes: { include: { site: true }, orderBy: { createdAt: 'desc' } },
      affiliates: { select: { id: true, name: true, email: true } },
      referer: { select: { id: true, name: true, email: true } },
      events: { orderBy: { createdAt: 'desc' }, take: 20 },
      workflowStates: {
        include: { workflow: true },
        orderBy: { updatedAt: 'desc' }
      },
      executions: {
        include: { action: true },
        orderBy: { executedAt: 'desc' },
        take: 20
      },
      jobs: { orderBy: { createdAt: 'desc' }, take: 20 },
      outbox: { orderBy: { createdAt: 'desc' }, take: 20 }
    }
  });

  if (!user) {
    notFound();
  }

  const avatar = user.image ?? `https://avatar.vercel.sh/${user.email}?size=40`;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/users" className="p-2 rounded-md hover:bg-muted">
            <LuArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Users</span>
          </Link>
          <Avatar className="h-12 w-12 rounded-lg">
            <AvatarImage src={avatar} alt={user.name ?? user.email} />
            <AvatarFallback className="rounded-lg text-lg">
              {(user.name?.[0] || user.email[0])?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {user.name || 'Unnamed User'}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Badge
          variant={
            (
              {
                [UserRole.ADMIN]: 'destructive',
                [UserRole.SELLER]: 'secondary',
                [UserRole.USER]: 'default',
                [UserRole.LEAD]: 'outline',
                [UserRole.GUEST]: 'outline'
              } as const
            )[user.role]
          }
        >
          {user.role}
        </Badge>
      </div>
      <Separator />

      {props.children}
    </div>
  );
}

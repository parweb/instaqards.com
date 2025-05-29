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
  const { userId } = await props.params;

  if (!userId) {
    notFound();
  }

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    select: {
      role: true,
      name: true,
      email: true,
      image: true
    }
  });

  if (!user) {
    notFound();
  }

  const avatar = user.image ?? `https://avatar.vercel.sh/${user.email}?size=40`;

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Link href="/users" className="hover:bg-muted rounded-md p-2">
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

            <p className="text-muted-foreground text-sm">{user.email}</p>
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

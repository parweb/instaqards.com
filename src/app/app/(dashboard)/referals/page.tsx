import { UserRole } from '@prisma/client';

import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { UserTree } from './user-tree';

export default async function ReferalsPage() {
  const users = await db.user.findMany({
    where: {
      affiliates: {
        some: {}
      }
    },
    include: {
      affiliates: {
        include: {
          affiliates: {
            include: {
              affiliates: {
                include: {
                  affiliates: true
                }
              }
            }
          }
        }
      }
    }
  });

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {await translate('dashboard.referals.title')}
          </h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <UserTree
            rootUsers={[
              {
                id: 'root',
                name: 'root',
                email: 'root',
                emailVerified: null,
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                password: null,
                isTwoFactorEnabled: false,
                billing_address: null,
                payment_method: null,
                role: UserRole.USER,
                refererId: null,
                affiliates: users
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}

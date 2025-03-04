import { redirect } from 'next/navigation';

import Form from 'components/form';
import { PortalButton } from 'components/portal-button';
import { PriceTable } from 'components/price-table';
import { db } from 'helpers';
import { editUser } from 'lib/actions';
import { getSession, getSubscription } from 'lib/auth';

export default async function SettingsPage() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/login');
  }

  const subscription = await getSubscription();

  const products = await db.product.findMany({
    where: { active: { equals: true } },
    include: {
      prices: {
        where: {
          active: { equals: true },
          interval_count: { equals: 1 }
        }
      }
    }
  });

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>

        <div className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black">
          <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
            <h2 className="font-cal text-xl dark:text-white">Subscription</h2>

            <p className="text-sm text-stone-500 dark:text-stone-400">
              Your subscription.
            </p>
          </div>

          <div className="w-full overflow-scroll">
            {/* @ts-ignore */}
            <PriceTable products={products} subscription={subscription} />
          </div>

          {subscription.valid() && (
            <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Manage your subscription on Stripe.
              </p>

              <PortalButton>
                <p>Manage</p>
              </PortalButton>
            </div>
          )}
        </div>

        <Form
          title="Two factor authentification"
          description="Enable two factor authentication for your account"
          helpText=""
          inputAttrs={{
            name: 'isTwoFactorEnabled',
            type: 'switch',
            defaultValue: session.user.isTwoFactorEnabled ?? false,
            placeholder: 'Your name'
          }}
          handleSubmit={
            editUser as <T>(
              data: FormData,
              id: string,
              name: string
            ) => Promise<T | { error?: string }>
          }
        />

        <Form
          title="Name"
          description="Your name on this app."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: 'name',
            type: 'text',
            defaultValue: session.user.name ?? '',
            placeholder: 'Your name',
            maxLength: 32
          }}
          handleSubmit={
            editUser as <T>(
              data: FormData,
              id: string,
              name: string
            ) => Promise<T | { error?: string }>
          }
        />

        <Form
          title="Email"
          description="Your email on this app."
          helpText="Please enter a valid email."
          inputAttrs={{
            name: 'email',
            type: 'email',
            defaultValue: session.user.email ?? '',
            placeholder: 'Your email'
          }}
          handleSubmit={
            editUser as <T>(
              data: FormData,
              id: string,
              name: string
            ) => Promise<T | { error?: string }>
          }
        />
      </div>
    </div>
  );
}

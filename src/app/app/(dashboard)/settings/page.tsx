import Link from 'next/link';

import { Price } from 'app/(marketing)/home/section/price';
import Form from 'components/form';
import { PortalButton } from 'components/portal-button';
import { Button } from 'components/ui/button';
import { db } from 'helpers/db';
import { getLang } from 'helpers/translate';
import { patchUser } from 'lib/actions';
import { getAuth, getSubscription } from 'lib/auth';

export default async function SettingsPage() {
  const auth = await getAuth();

  const lang = await getLang();

  const prices = await db.price.findMany({
    where: {
      product: {
        active: true
      }
    }
  });

  const subscription = await getSubscription();

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
            <Price
              lang={lang}
              prices={prices}
              standalone
              begin={false}
              trial={false}
              border={false}
            />
          </div>

          {subscription.valid() && (
            <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10 dark:border-stone-700 dark:bg-stone-800">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Manage your subscription on Stripe.
              </p>

              <PortalButton>
                <p>Manage</p>
              </PortalButton>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black">
          <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
            <h2 className="font-cal text-xl dark:text-white">Receive money</h2>

            <div>
              <Button asChild>
                <Link href="/api/stripe/connect">Connect Stripe</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* <Form
          title="Two factor authentification"
          description="Enable two factor authentication for your account"
          helpText=""
          inputAttrs={{
            name: 'isTwoFactorEnabled',
            type: 'switch',
            defaultValue: auth.isTwoFactorEnabled ?? false,
            placeholder: 'Your name'
          }}
          handleSubmit={
            patchUser as <T>(
              data: FormData, // eslint-disable-line no-unused-vars
              id: string, // eslint-disable-line no-unused-vars
              name: string // eslint-disable-line no-unused-vars
            ) => Promise<T | { error?: string }>
          }
        /> */}

        <Form
          title="Name"
          description="Your name on this app."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: 'name',
            type: 'text',
            defaultValue: auth.name ?? '',
            placeholder: 'Your name',
            maxLength: 32
          }}
          handleSubmit={
            patchUser as <T>(
              data: FormData, // eslint-disable-line no-unused-vars
              id: string, // eslint-disable-line no-unused-vars
              name: string // eslint-disable-line no-unused-vars
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
            defaultValue: auth.email ?? '',
            placeholder: 'Your email'
          }}
          handleSubmit={
            patchUser as <T>(
              data: FormData, // eslint-disable-line no-unused-vars
              id: string, // eslint-disable-line no-unused-vars
              name: string // eslint-disable-line no-unused-vars
            ) => Promise<T | { error?: string }>
          }
        />
      </div>
    </div>
  );
}

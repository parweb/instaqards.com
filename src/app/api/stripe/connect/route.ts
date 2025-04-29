// import { stripe } from "helpers/stripe";
import Stripe from 'stripe';

import { getSession } from 'lib/auth';
import { uri } from 'settings';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
    apiVersion: '2025-02-24.acacia',
    appInfo: {
      name: 'Qards',
      version: '0.1.0'
    }
  });

  const account = await stripe.accounts.create({
    type: 'express',
    country: 'FR',
    ...(session.user.email && { email: session.user.email }),
    capabilities: { transfers: { requested: true } }
  });

  console.info({ account });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: uri.base('/reauth'),
    return_url: uri.base('/connected'),
    type: 'account_onboarding'
  });

  console.info({ accountLink });

  return Response.redirect(accountLink.url, 303);
}

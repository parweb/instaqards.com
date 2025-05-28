import { nanoid } from 'nanoid';
import { after } from 'next/server';
import type Stripe from 'stripe';

import { createOrRetrieveCustomer } from 'data/customer';
import { db } from 'helpers/db';
import { getURL } from 'helpers/getURL';
import { stripe } from 'helpers/stripe';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';
import { input } from './input';

export async function POST(req: Request) {
  try {
    const { priceId, metadata = {} } = input.parse(await req.json());

    const price = await db.price.findUnique({
      select: { interval: true, id: true, type: true },
      where: { id: priceId }
    });

    const quantity = price?.interval === 'month' ? 1 : 12;
    console.info({ priceId, quantity, metadata });

    if (!price) {
      throw new Error(await translate('api.stripe.error'));
    }

    console.info({ price });

    const { user = null } = (await getSession()) || {};

    if (user === null)
      throw new Error(await translate('api.stripe.user.error'));

    const customer = await createOrRetrieveCustomer(user);

    console.info({ customer });

    let session: Stripe.Checkout.Session | null = null;

    if (price.type === 'recurring') {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer,
        line_items: [{ price: price.id, quantity }],
        mode: 'subscription',
        allow_promotion_codes: true,
        payment_method_collection: 'if_required',
        subscription_data: { metadata },
        success_url: `${getURL()}/`,
        cancel_url: `${getURL()}/`
      });
    } else if (price.type === 'one_time') {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer,
        billing_address_collection: 'required',
        customer_update: { address: 'auto' },
        line_items: [{ price: price.id, quantity }],
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: `${getURL()}/account`,
        cancel_url: `${getURL()}/`
      });
    }

    if (!session) {
      throw new Error(await translate('api.stripe.error'), {
        cause: session
      });
    }

    after(() => {
      db.event
        .create({
          data: {
            userId: String(user?.id),
            eventType: 'CHECKOUT_SESSION_CREATED',
            payload: JSON.parse(JSON.stringify(session)),
            correlationId: nanoid()
          }
        })
        .then(event => {
          console.info('events::createCheckoutSession', event);
        })
        .catch(error => {
          console.error('events::createCheckoutSession', error);
        });
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200
    });
  } catch (error: unknown) {
    console.error({ error });
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

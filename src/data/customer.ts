import { User } from 'next-auth';
import Stripe from 'stripe';

import { PricingPlanInterval } from '@prisma/client';
import { db, stripe } from 'helpers';

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const createOrRetrieveCustomer = async ({
  id: uuid,
  email,
  name
}: User) => {
  const customer = await db.customer.findUnique({ where: { id: uuid } });

  if (!customer || !customer?.stripe_customer_id) {
    const customerData: {
      metadata: { user_id: string };
      email?: string;
      name?: string;
    } = {
      metadata: { user_id: uuid! }
    };

    if (email) customerData.email = email;
    if (name) customerData.name = name;

    const customer = await stripe.customers.create(customerData);

    console.log({ customer });

    await db.customer.create({
      data: {
        id: uuid!,
        stripe_customer_id: customer.id
      }
    });

    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }

  return customer.stripe_customer_id;
};

export const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;

  if (!name || !phone || !address) return;

  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });

  await db.user.update({
    where: { id: uuid },
    data: {
      billing_address: { ...address },
      // @ts-ignore
      payment_method: { ...payment_method[payment_method.type] }
    }
  });
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  const customerData = await db.customer.findUnique({
    where: { stripe_customer_id: customerId }
  });

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });

  const subscriptionData = {
    userId: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null
  };

  await db.subscription.upsert({
    where: { id: subscription.id },
    create: { ...subscriptionData, id: subscription.id },
    update: subscriptionData
  });

  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    active: product.active,
    name: product.name,
    description: product.description ?? '',
    image: product.images?.[0] ?? '',
    metadata: product.metadata
  };

  console.log({ productData });

  await db.product.upsert({
    where: { id: product.id },
    create: { ...productData, id: product.id },
    update: productData
  });

  console.log(`Product inserted/updated: ${product.id}`);
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData = {
    productId: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? '',
    type: price.type,
    unit_amount: price?.unit_amount ?? null,
    interval: (price.recurring?.interval as PricingPlanInterval) ?? '',
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata
  };

  await db.price.upsert({
    where: { id: price.id },
    create: { ...priceData, id: price.id },
    update: priceData
  });

  console.log(`Price inserted/updated: ${price.id}`);
};

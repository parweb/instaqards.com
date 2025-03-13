import { auth } from 'auth';
import { createOrRetrieveCustomer } from 'data/customer';
import { getURL } from 'helpers/getURL';
import { stripe } from 'helpers/stripe';
import { translate } from 'helpers/translate';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { user = null } = (await auth()) || {};

      if (!user) throw Error(translate('api.stripe.user.not-found'));

      const customer = await createOrRetrieveCustomer(user);

      if (!customer) throw Error(translate('api.stripe.customer.error'));

      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/`
      });

      return new Response(JSON.stringify({ url }), {
        status: 200
      });
    } catch (error: unknown) {
      console.log(error);
      return new Response(
        JSON.stringify({
          error: {
            statusCode: 500,
            message: (error as Error)?.message ?? 'Unknown error'
          }
        }),
        {
          status: 500
        }
      );
    }
  } else {
    return new Response(translate('api.method.not-allowed'), {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}

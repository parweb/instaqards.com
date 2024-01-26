import { auth } from 'auth';
import { createOrRetrieveCustomer } from 'data/customer';
import { getURL, stripe } from 'helpers';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { user = null } = (await auth()) || {};

      if (!user) throw Error('Could not get user');

      const customer = await createOrRetrieveCustomer(user);

      if (!customer) throw Error('Could not get customer');

      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/`
      });

      return new Response(JSON.stringify({ url }), {
        status: 200
      });
    } catch (err: any) {
      console.log(err);
      return new Response(
        JSON.stringify({ error: { statusCode: 500, message: err.message } }),
        {
          status: 500
        }
      );
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}

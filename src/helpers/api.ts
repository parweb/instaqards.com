import { type Input } from 'app/api/create-checkout-session/input';
import { input } from 'app/api/create-checkout-session/input';

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: Input;
}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(input.parse(data))
  });

  if (!res.ok) {
    throw Error(res.statusText);
  }

  return res.json();
};

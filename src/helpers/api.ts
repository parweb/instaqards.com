export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: Record<string, unknown>;
}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw Error(res.statusText);
  }

  return res.json();
};

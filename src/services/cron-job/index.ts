'use server';

const endpoint = 'https://api.cron-job.org';
export const request = async (
  path: string,
  method: 'GET' | 'POST' | 'PATCH',
  options: any = {}
) => {
  console.log('api/cron::request()', { path, method, options });

  const params = [
    `${endpoint}${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${process.env.CRON_JOB_SECRET}`,
        'Content-Type': 'application/json'
      },
      ...options
    }
  ];

  console.log('params', ...params);

  // @ts-ignore
  const response = await fetch(...params);

  if (!response.ok) {
    throw new Error('Failed to fetch', { cause: response });
  }

  return response.json();
};

export const active = async () => {
  const result = await request(`/jobs/${process.env.CRON_JOB_ID}`, 'PATCH', {
    body: JSON.stringify({
      job: { enabled: true }
    })
  });

  console.log({ result });

  return result;
};

export const disable = async () => {
  const result = await request(`/jobs/${process.env.CRON_JOB_ID}`, 'PATCH', {
    body: JSON.stringify({
      job: { enabled: false }
    })
  });

  console.log({ result });

  return result;
};

export const get = async () => {
  const result = await request(`/jobs/${process.env.CRON_JOB_ID}`, 'GET').catch(
    e => {
      console.error(e);
      return null;
    }
  );

  console.log({ result });

  return result?.jobDetails ?? false;
};

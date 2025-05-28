import { revalidatePath } from 'next/cache';
import Form from 'next/form';

import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getAuth } from 'lib/auth';

export default async function FeedbackPage() {
  const auth = await getAuth();

  const feedbacks = await db.feedback.findMany({
    include: {
      user: true
    },
    where: {
      userId: auth.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold">
            {await translate('dashboard.feedback.title')}
          </h1>
        </div>

        <div>
          <Form
            className="flex flex-col gap-4 border border-stone-200 rounded-md p-4"
            action={async formData => {
              'use server';

              const message = String(formData.get('message'));

              await db.feedback.create({
                data: {
                  message,
                  userId: auth.id
                }
              });

              revalidatePath('/feedback');
            }}
          >
            <header className="flex items-center justify-between">
              <h2 className="font-cal text-lg font-bold">
                {await translate('dashboard.feedback.description')}
              </h2>
            </header>

            <AutosizeTextarea
              name="message"
              placeholder={await translate('dashboard.feedback.placeholder')}
            />

            <div>
              <Button type="submit">
                {await translate('dashboard.feedback.submit')}
              </Button>
            </div>
          </Form>

          <div className="mt-8 space-y-4">
            {feedbacks.map(feedback => (
              <div
                key={feedback.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-stone-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center">
                    <span className="text-sm text-stone-600">
                      {feedback.user?.name?.[0] ?? '?'}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-stone-700">
                      {feedback.user?.name ?? 'Anonymous'}
                    </span>

                    <span className="text-xs text-stone-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-stone-600 whitespace-pre-wrap">
                  {feedback.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

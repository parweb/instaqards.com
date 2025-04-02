import { revalidatePath } from 'next/cache';
import Form from 'next/form';
import { LuTrash } from 'react-icons/lu';

import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { db } from 'helpers/db';

export default async function WorkflowsTriggers() {
  const triggers = await db.trigger.findMany();

  return (
    <div className="flex flex-col space-y-6">
      <Form
        className="flex flex-col gap-4 border border-stone-200 rounded-md p-4"
        action={async form => {
          'use server';

          const code = String(form.get('code')).toUpperCase();
          const description = String(form.get('description'));

          await db.trigger.create({
            data: {
              code,
              description
            }
          });

          revalidatePath('/workflows/triggers');
        }}
      >
        <div>
          <Input className="w-auto" name="code" placeholder="Code" />
        </div>

        <AutosizeTextarea name="description" placeholder="Description" />

        <div>
          <Button type="submit">save</Button>
        </div>
      </Form>

      {triggers.map(trigger => (
        <div key={trigger.id} className="flex gap-4 items-center">
          <Button
            size="sm"
            type="submit"
            className="bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: `url("https://avatar.vercel.sh/${trigger.code}")`,
              textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
            }}
          >
            {trigger.code}
          </Button>

          <p>{trigger.description}</p>

          <div>
            <form>
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-red-500"
                formAction={async () => {
                  'use server';

                  await db.trigger.delete({
                    where: { id: trigger.id }
                  });

                  revalidatePath('/workflows/triggers');
                }}
              >
                <LuTrash />
              </Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

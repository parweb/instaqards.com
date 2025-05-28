import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from 'components/ui/button';
import { db } from 'helpers/db';
import { cn } from 'lib/utils';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from 'components/ui/carousel';
import Form from 'next/form';
import { Input } from 'components/ui/input';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Switch } from 'components/ui/switch';
import { Label } from 'components/ui/label';
import { revalidatePath } from 'next/cache';

export default async function WorkflowActionsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const types = await db.action
    .findMany({
      select: {
        type: true
      },
      distinct: ['type']
    })
    .then(actions => actions.map(action => action.type));

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <Carousel opts={{ align: 'start', loop: true }} className="">
          <CarouselContent>
            {types.map(type => (
              <CarouselItem key={type} className="flex">
                <Button
                  asChild
                  type="submit"
                  className={cn(
                    'bg-cover bg-center transition-all duration-300',
                    {
                      'opacity-40': false,
                      'opacity-100': false
                    }
                  )}
                  style={{
                    backgroundImage: `url("https://avatar.vercel.sh/${type}")`,
                    textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <Link prefetch href={`/workflows/actions/${type}`}>
                    {type}
                  </Link>
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div>
          <Form
            className="flex flex-col gap-4 p-4"
            action={async form => {
              'use server';

              const code = String(form.get('code')).toUpperCase();
              const description = String(form.get('description'));
              const type = String(form.get('type')).toUpperCase();
              const config = JSON.parse(form.get('config') as string);
              const isPublished = form.get('isPublished') === 'on';

              await db.action.create({
                data: {
                  code,
                  description,
                  type,
                  config,
                  isPublished
                }
              });

              revalidatePath('/workflows/actions');
            }}
          >
            <div className="flex flex-col gap-4">
              <Label>
                <Switch name="isPublished" defaultChecked /> Published
              </Label>

              <Input name="type" placeholder="Type" required />
              <Input name="code" placeholder="Code" required />

              <AutosizeTextarea
                name="description"
                placeholder="Description"
                required
              />

              <AutosizeTextarea
                required
                name="config"
                placeholder="Config"
                defaultValue={`{
    
}`}
              />
            </div>

            <div>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </div>
      </div>

      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}

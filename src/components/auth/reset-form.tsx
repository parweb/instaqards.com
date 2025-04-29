'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import type * as z from 'zod';

import { reset } from 'actions/reset';
import { CardWrapper } from 'components/auth/card-wrapper';
import { FormError } from 'components/form-error';
import { FormSuccess } from 'components/form-success';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { ResetSchema } from 'schemas';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from 'components/ui/form';

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      reset(values)
        .then(data => {
          setError(data?.error);
          setSuccess(data?.success);
        })
        .catch(error => {
          console.error({ error });
          if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
            setError('Something went wrong');
          }
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <LuLoader className="animate-spin" />
            ) : (
              'Send reset email'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

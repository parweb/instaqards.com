'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import type * as z from 'zod';

import { login } from 'actions/login';
import { CardWrapper } from 'components/auth/card-wrapper';
import { FormError } from 'components/form-error';
import { FormSuccess } from 'components/form-success';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { LoginSchema } from 'schemas';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from 'components/ui/form';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl)
        .then(data => {
          if ('error' in data) {
            if ('code' in data) {
              setError(data.message);
            } else setError(data.error);
          }

          if ('success' in data) {
            form.reset();
            router.push(String(data.success?.callbackUrl));
          }
        })
        .catch(error => {
          console.error({ error });

          if (error instanceof Error) {
            setError('Something went wrong');
          }
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Login to your account"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >
      <Form {...form}>
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!showTwoFactor && (
              <>
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <div className="relative flex items-center gap-2">
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="******"
                            className="flex-1"
                            type={showPassword ? 'text' : 'password'}
                          />
                          <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            className="absolute top-0 right-0 h-full px-3"
                            onClick={() => setShowPassword(prev => !prev)}
                          >
                            {showPassword ? (
                              <EyeOffIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>

                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link prefetch href="/reset">
                          Forgot password?
                        </Link>
                      </Button>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <LuLoader className="animate-spin" />
            ) : showTwoFactor ? (
              'Confirm'
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

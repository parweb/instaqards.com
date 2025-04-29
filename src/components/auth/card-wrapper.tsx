'use client';

import Image from 'next/image';

import { BackButton } from 'components/auth/back-button';
import { Header } from 'components/auth/header';
import { Social } from 'components/auth/social';
import { Card, CardContent, CardFooter, CardHeader } from 'components/ui/card';
import { uri } from 'settings';

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  const ratio = 0.3333;

  return (
    <Card className="max-w-[500px] border-none shadow-none">
      <CardHeader>
        <div className="lg:hidden flex items-center justify-center">
          <Image
            src="/rsz_black-transparent_withlink.png"
            alt="Logo qards.link"
            width={800 * ratio}
            height={400 * ratio}
          />
        </div>

        <Header label={headerLabel} />
      </CardHeader>

      <CardContent>{children}</CardContent>

      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}

      <CardFooter className="flex flex-col gap-4">
        <BackButton label={backButtonLabel} href={backButtonHref} />

        <BackButton label="back to home" href={uri.base()} />
      </CardFooter>
    </Card>
  );
};

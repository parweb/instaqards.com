import Link from 'next/link';
import { LuCircleAlert } from 'react-icons/lu';

import { Alert, AlertDescription } from 'components/ui/alert';
import { translate } from 'helpers/translate';
import { uri } from 'settings';

const EmailInPage = async () => {
  return (
    <div className="flex max-w-[500px] flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-12 w-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            role="img"
            aria-label="Email icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900">
          {await translate('page.auth.email-in.title')}
        </h2>

        <p className="text-sm text-gray-600">
          {await translate('page.auth.email-in.description')}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Alert>
          <LuCircleAlert className="h-4 w-4" />

          <AlertDescription className="flex flex-col gap-4">
            <div>{await translate('page.auth.email-in.alert')}</div>
          </AlertDescription>
        </Alert>

        <div className="text-sm text-gray-500">
          <Link prefetch href={uri.base()}>
            {await translate('auth.return.home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailInPage;

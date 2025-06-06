'use client';

import { LuCircleAlert, LuCircleCheck, LuCircleX } from 'react-icons/lu';

import LoadingSpinner from './loading-spinner';
import { useDomainStatus } from './use-domain-status';

export default function DomainStatus({ domain }: { domain: string }) {
  const { status, loading } = useDomainStatus({ domain });

  return loading ? (
    <LoadingSpinner />
  ) : status === 'Valid Configuration' ? (
    <LuCircleCheck
      fill="#2563EB"
      stroke="currentColor"
      className="text-white dark:text-black"
    />
  ) : status === 'Pending Verification' ? (
    <LuCircleAlert
      fill="#FBBF24"
      stroke="currentColor"
      className="text-white dark:text-black"
    />
  ) : (
    <LuCircleX
      fill="#DC2626"
      stroke="currentColor"
      className="text-white dark:text-black"
    />
  );
}

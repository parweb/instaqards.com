import { getSession } from 'lib/auth';

export type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>;

export type DomainVerificationStatusProps =
  | 'Valid Configuration'
  | 'Invalid Configuration'
  | 'Pending Verification'
  | 'Domain Not Found'
  | 'Unknown Error';

export interface DomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: (307 | 301 | 302 | 308) | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  verified: boolean;
  verification: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

export interface DomainConfigResponse {
  configuredBy?: ('CNAME' | 'A' | 'http') | null;
  acceptedChallenges?: ('dns-01' | 'http-01')[];
  misconfigured: boolean;
}

export interface DomainVerificationResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: (307 | 301 | 302 | 308) | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  verified: boolean;
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

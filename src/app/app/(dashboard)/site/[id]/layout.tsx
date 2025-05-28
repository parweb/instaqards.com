import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col self-stretch p-0">{children}</div>
  );
}

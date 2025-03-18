import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col p-0 flex-1 self-stretch">{children}</div>
  );
}

import Link from 'next/link';

import './layout.css';
import { Suspense } from 'react';

export default function ExploreLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-0 self-stretch">
      <Suspense fallback={null}>
        <div className="flex flex-1 flex-col self-stretch">{children}</div>
      </Suspense>

      <div className="flex flex-wrap items-center justify-around gap-4 p-2">
        <Link href="/explore/region">Régions</Link>
        <Link href="/explore/state">Départements</Link>
        <Link href="/explore/city">Villes</Link>
        <Link href="/explore/section">Sections</Link>
        <Link href="/explore/division">Divisions</Link>
        <Link href="/explore/group">Groupes</Link>
        <Link href="/explore/class">Classes</Link>
        <Link href="/explore/activity">Activités</Link>
      </div>
    </div>
  );
}

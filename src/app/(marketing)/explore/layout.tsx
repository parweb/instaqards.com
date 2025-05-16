import Link from 'next/link';

import './layout.css';

export default function ExploreLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col self-stretch gap-0">
      <div className="flex-1 flex flex-col self-stretch">{children}</div>

      <div className="p-2 flex items-center justify-around gap-4">
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

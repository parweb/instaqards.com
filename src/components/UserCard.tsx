import Link from 'next/link';

interface User {
  id: string | number;
  name?: string;
  raisonSociale?: string;
  activity?: string;
  activite?: string;
  codeNaf?: string;
  city?: string;
  ville?: string;
  postcode?: string;
}

export function UserCard({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-2 rounded border bg-white p-4 shadow transition hover:border-blue-500">
      <h2 className="truncate text-lg font-bold">
        {user.name || user.raisonSociale || 'Commerce sans nom'}
      </h2>
      <div className="text-sm text-gray-600">
        {user.activity || user.activite || 'Activité inconnue'} — {user.codeNaf}
      </div>
      <div className="text-sm">
        {user.city || user.ville} ({user.postcode})
      </div>
      <div className="text-sm">
        Département :
        <Link
          href={`/explore/state/${user.postcode?.slice(0, 2)}`}
          className="ml-1 text-blue-600 underline hover:text-blue-800"
        >
          {user.postcode?.slice(0, 2)}
        </Link>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          href={`/user/${user.id}`}
          className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
        >
          Voir le détail
        </Link>
        <Link
          href={`/explore/activity/${user.codeNaf}`}
          className="rounded bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300"
        >
          Voir cette activité
        </Link>
        <Link
          href={`/explore/city/${user.postcode}`}
          className="rounded bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300"
        >
          Voir cette ville
        </Link>
      </div>
    </div>
  );
}

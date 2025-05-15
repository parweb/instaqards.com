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
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2 border hover:border-blue-500 transition">
      <h2 className="text-lg font-bold truncate">
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
          className="underline text-blue-600 ml-1 hover:text-blue-800"
        >
          {user.postcode?.slice(0, 2)}
        </Link>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap">
        <Link
          href={`/user/${user.id}`}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
        >
          Voir le détail
        </Link>
        <Link
          href={`/explore/activity/${user.codeNaf}`}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
        >
          Voir cette activité
        </Link>
        <Link
          href={`/explore/city/${user.postcode}`}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
        >
          Voir cette ville
        </Link>
      </div>
    </div>
  );
}

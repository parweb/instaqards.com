import Link from 'next/link';

interface FiltersBarProps {
  city?: string;
  state?: string;
  naf?: string;
}

export function FiltersBar({ city, state, naf }: FiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center text-sm">
      {city && (
        <span>
          Ville :{' '}
          <Link
            href={`/explore/city/${city}`}
            className="underline text-blue-600 hover:text-blue-800"
          >
            {city}
          </Link>
        </span>
      )}
      {state && (
        <span>
          Département :{' '}
          <Link
            href={`/explore/state/${state}`}
            className="underline text-blue-600 hover:text-blue-800"
          >
            {state}
          </Link>
        </span>
      )}
      {naf && (
        <span>
          Activité :{' '}
          <Link
            href={`/explore/activity/${naf}`}
            className="underline text-blue-600 hover:text-blue-800"
          >
            {naf}
          </Link>
        </span>
      )}
    </div>
  );
}

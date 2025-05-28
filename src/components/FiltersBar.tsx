import Link from 'next/link';

interface FiltersBarProps {
  name: 'city' | 'state' | 'naf' | 'class' | 'division' | 'group' | 'section';
  value: string;
}

const filterConfig = {
  city: { label: 'Ville', path: 'city' },
  state: { label: 'Département', path: 'state' },
  naf: { label: 'Activité', path: 'activity' },
  class: { label: 'Classe', path: 'class' },
  division: { label: 'Division', path: 'division' },
  group: { label: 'Groupe', path: 'group' },
  section: { label: 'Section', path: 'section' }
} as const;

export function FiltersBar({ name, value }: FiltersBarProps) {
  const config = filterConfig[name];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
      <span>
        {config.label} :{' '}
        <Link
          href={`/explore/${config.path}/${value}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {value}
        </Link>
      </span>
    </div>
  );
}

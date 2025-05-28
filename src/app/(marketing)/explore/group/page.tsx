import { db } from 'helpers/db';
import Link from 'next/link';
import slugify from 'slugify';

export default async function ActivityPage() {
  const groups = await db.nafGroup.findMany({
    select: {
      id: true,
      title: true,
      division: {
        select: {
          id: true,
          title: true,
          section: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">{'Groupes'}</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(group => (
          <div
            key={group.id}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600">
                {group.id}
              </span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              <Link href={`/explore/group/${group.id}-${slugify(group.title)}`}>
                {group.title}
              </Link>
            </h2>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <span className="font-medium">Section:</span>
                <Link
                  href={`/explore/section/${group.division.section.id}-${slugify(group.division.section.title)}`}
                >
                  {group.division.section.title}
                </Link>
              </p>

              <p className="flex items-center gap-1">
                <span className="font-medium">Division:</span>
                <Link
                  href={`/explore/division/${group.division.id}-${slugify(group.division.title)}`}
                >
                  {group.division.title}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

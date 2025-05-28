import { db } from 'helpers/db';
import Link from 'next/link';
import slugify from 'slugify';

export default async function ActivityPage() {
  const classes = await db.nafClass.findMany({
    select: {
      id: true,
      title: true,
      group: {
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
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">{'Classes'}</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map(item => (
          <div
            key={item.id}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600">
                {item.id}
              </span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              <Link href={`/explore/class/${item.id}-${slugify(item.title)}`}>
                {item.title}
              </Link>
            </h2>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <span className="font-medium">Section:</span>
                <Link
                  href={`/explore/section/${item.group.division.section.id}-${slugify(item.group.division.section.title)}`}
                >
                  {item.group.division.section.title}
                </Link>
              </p>

              <p className="flex items-center gap-1">
                <span className="font-medium">Division:</span>
                <Link
                  href={`/explore/division/${item.group.division.id}-${slugify(item.group.division.title)}`}
                >
                  {item.group.division.title}
                </Link>
              </p>

              <p className="flex items-center gap-1">
                <span className="font-medium">Groupe:</span>
                <Link
                  href={`/explore/group/${item.group.id}-${slugify(item.group.title)}`}
                >
                  {item.group.title}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

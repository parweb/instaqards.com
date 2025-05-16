import { db } from 'helpers/db';
import Link from 'next/link';
import slugify from 'slugify';

export default async function ActivityPage() {
  const classes = await db.nafClass.findMany({
    include: {
      group: {
        include: {
          division: {
            include: {
              section: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{'Classes'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {item.id}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              <Link
                href={`/explore/class/${item.id.replace('.', '')}-${slugify(item.title)}`}
              >
                {item.title}
              </Link>
            </h2>

            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex gap-1 items-center">
                <span className="font-medium">Section:</span>
                <Link
                  href={`/explore/section/${item.group.division.section.id.replace('.', '')}-${slugify(item.group.division.section.title)}`}
                >
                  {item.group.division.section.title}
                </Link>
              </p>

              <p className="flex gap-1 items-center">
                <span className="font-medium">Division:</span>
                <Link
                  href={`/explore/division/${item.group.division.id.replace('.', '')}-${slugify(item.group.division.title)}`}
                >
                  {item.group.division.title}
                </Link>
              </p>

              <p className="flex gap-1 items-center">
                <span className="font-medium">Groupe:</span>
                <Link
                  href={`/explore/group/${item.group.id.replace('.', '')}-${slugify(item.group.title)}`}
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

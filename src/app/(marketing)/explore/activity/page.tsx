import { db } from 'helpers/db';
import Link from 'next/link';
import slugify from 'slugify';

export default async function ActivityPage() {
  const codes = await db.nafCode.findMany({
    include: {
      class: {
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
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        {"Codes d'Activités"}
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {codes.map(code => (
          <div
            key={code.id}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600">
                {code.id}
              </span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              <Link
                href={`/explore/activity/${code.id}-${slugify(code.title)}`}
              >
                {code.title}
              </Link>
            </h2>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <span className="font-medium">Section:</span>
                <Link
                  href={`/explore/section/${code.class.group.division.section.id}-${slugify(code.class.group.division.section.title)}`}
                >
                  {code.class.group.division.section.title}
                </Link>
              </p>

              <p className="flex items-center gap-1">
                <span className="font-medium">Division:</span>
                <Link
                  href={`/explore/division/${code.class.group.division.id}-${slugify(code.class.group.division.title)}`}
                >
                  {code.class.group.division.title}
                </Link>
              </p>

              <p className="flex items-center gap-1">
                <span className="font-medium">Groupe:</span>
                <Link
                  href={`/explore/group/${code.class.group.id}-${slugify(code.class.group.title)}`}
                >
                  {code.class.group.title}
                </Link>
              </p>

              <p className="flex items-center gap-1">
                <span className="font-medium">Classe:</span>
                <Link
                  href={`/explore/class/${code.class.id}-${slugify(code.class.title)}`}
                >
                  {code.class.title}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {"Codes d'Activités"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codes.map(code => (
          <div
            key={code.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {code.id}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              <Link
                href={`/explore/activity/${code.id.replace('.', '')}-${slugify(code.title)}`}
              >
                {code.title}
              </Link>
            </h2>

            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex gap-1 items-center">
                <span className="font-medium">Section:</span>
                <Link
                  href={`/explore/section/${code.class.group.division.section.id.replace('.', '')}-${slugify(code.class.group.division.section.title)}`}
                >
                  {code.class.group.division.section.title}
                </Link>
              </p>

              <p className="flex gap-1 items-center">
                <span className="font-medium">Division:</span>
                <Link
                  href={`/explore/division/${code.class.group.division.id.replace('.', '')}-${slugify(code.class.group.division.title)}`}
                >
                  {code.class.group.division.title}
                </Link>
              </p>

              <p className="flex gap-1 items-center">
                <span className="font-medium">Groupe:</span>
                <Link
                  href={`/explore/group/${code.class.group.id.replace('.', '')}-${slugify(code.class.group.title)}`}
                >
                  {code.class.group.title}
                </Link>
              </p>

              <p className="flex gap-1 items-center">
                <span className="font-medium">Classe:</span>
                <Link
                  href={`/explore/class/${code.class.id.replace('.', '')}-${slugify(code.class.title)}`}
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

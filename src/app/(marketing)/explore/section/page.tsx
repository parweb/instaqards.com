import { db } from 'helpers/db';
import Link from 'next/link';
import slugify from 'slugify';

export default async function ActivityPage() {
  const sections = await db.nafSection.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{'Sections'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(section => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {section.id}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              <Link
                href={`/explore/section/${section.id}-${slugify(section.title)}`}
              >
                {section.title}
              </Link>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

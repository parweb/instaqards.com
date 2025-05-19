import { PrismaClient, UserRole } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const chunked = (array: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const readCsvFile = (filename: string, encoding: BufferEncoding) =>
  parse(fs.readFileSync(path.resolve(process.cwd(), filename), { encoding }), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter: ',',
    from_line: 1,
    quote: '"',
    escape: '"',
    relax_column_count: true
  });

export const importContactsParis = async (prisma: PrismaClient) => {
  const fileIds = range(1, 11).map(i => String(i).padStart(2, '0'));

  const files = await Promise.all(
    fileIds.map(id =>
      readCsvFile(`prisma/seed/fichier-contacts/paris-${id}.csv`, 'utf8')
    )
  );

  const total = files.reduce((acc, file) => acc + file.length, 0);

  console.log({ total });

  const data = new Map<string, string>();

  let i = 0;
  for (const file of files) {
    console.log('progress', ((i / total) * 100).toFixed(4));
    for (const row of file) {
      // console.log( 'progress', ((i / total) * 100).toFixed(4) );

      //   console.log(row);

      data.set(row?.['ADRESSE E-MAIL'], row);

      i++;
    }
  }

  console.log(data.size);

  const chunks = chunked(Array.from(data.values()), 100);

  console.log(chunks.length);

  let j = 0;
  for (const chunk of chunks) {
    await prisma.user.createMany({
      skipDuplicates: true,
      data: chunk.map(row => ({
        role: UserRole.LEAD,

        name: row['NOM'],
        company: row['NOM'],
        address: row['ADRESSE'],
        postcode: row['CODE POSTAL'],
        city: row['VILLE'],
        phone: row['TELEPHONE'].replace(/\s/g, '').slice(1),
        email: row['ADRESSE E-MAIL'],
        activity: row['ACTIVITE']
      }))
    });

    console.log('progress', ((j / chunks.length) * 100).toFixed(4));

    j++;
  }
};

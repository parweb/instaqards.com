import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

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

export const importCodeNaf = async (prisma: PrismaClient) => {
  const { sections, classes, codes, divisions, groups, levels, migrations } = {
    sections: readCsvFile(
      'prisma/seed/csv-code-naf/NafSection.csv',
      'utf8'
    ).map((row: { Code: string; Libellé: string }) => ({
      id: row.Code,
      title: row.Libellé
    })) as { id: string; title: string }[],
    classes: readCsvFile('prisma/seed/csv-code-naf/NafClass.csv', 'utf8').map(
      (row: { Code: string; Libellé: string }) => ({
        id: row.Code,
        title: row.Libellé
      })
    ) as { id: string; title: string }[],
    codes: readCsvFile('prisma/seed/csv-code-naf/NafCode.csv', 'utf8').map(
      (row: { Code: string; Libellé: string }) => ({
        id: row.Code,
        title: row.Libellé
      })
    ) as { id: string; title: string }[],
    divisions: readCsvFile(
      'prisma/seed/csv-code-naf/NafDivision.csv',
      'utf8'
    ).map((row: { Code: string; Libellé: string }) => ({
      id: row.Code,
      title: row.Libellé
    })) as { id: string; title: string }[],
    groups: readCsvFile('prisma/seed/csv-code-naf/NafGroup.csv', 'utf8').map(
      (row: { Code: string; Libellé: string }) => ({
        id: row.Code,
        title: row.Libellé
      })
    ) as { id: string; title: string }[],
    levels: readCsvFile('prisma/seed/csv-code-naf/NafLevel.csv', 'utf8').map(
      (row: {
        NIV1: string;
        NIV2: string;
        NIV3: string;
        NIV4: string;
        NIV5: string;
      }) => ({
        sectionId: row.NIV1,
        divisionId: row.NIV2,
        groupId: row.NIV3,
        classId: row.NIV4,
        codeId: row.NIV5
      })
    ) as {
      sectionId: string;
      divisionId: string;
      groupId: string;
      classId: string;
      codeId: string;
    }[],
    migrations: readCsvFile(
      'prisma/seed/csv-code-naf/NAF1->NAF2.csv',
      'utf8'
    ).map((row: { NAF1: string; NAF2: string }) => ({
      prev: row.NAF1,
      next: row.NAF2
    })) as { prev: string; next: string }[]
  };

  await prisma.$transaction(
    migrations.map(({ prev, next }) =>
      prisma.user.updateMany({
        where: { codeNaf: prev.replace('.', '').slice(0, 4) },
        data: { codeNaf: next.slice(0, 6) }
      })
    )
  );

  await prisma.user.deleteMany({
    where: {
      codeNaf: { not: { contains: '.' } }
    }
  });

  await Promise.all(
    sections.map(section =>
      prisma.nafSection.upsert({
        where: { id: section.id },
        update: { title: section.title },
        create: { id: section.id, title: section.title }
      })
    )
  );

  await Promise.all(
    divisions.map(division => {
      const level = levels.find(({ divisionId }) => divisionId === division.id);

      return prisma.nafDivision.upsert({
        where: { id: division.id },
        update: {
          title: division.title,
          section: {
            connect: { id: level?.sectionId }
          }
        },
        create: {
          id: division.id,
          title: division.title,
          section: {
            connect: { id: level?.sectionId }
          }
        }
      });
    })
  );

  await Promise.all(
    groups.map(group => {
      const level = levels.find(({ groupId }) => groupId === group.id);

      return prisma.nafGroup.upsert({
        where: { id: group.id },
        update: {
          title: group.title,
          division: {
            connect: { id: level?.divisionId }
          }
        },
        create: {
          id: group.id,
          title: group.title,
          division: {
            connect: { id: level?.divisionId }
          }
        }
      });
    })
  );

  await Promise.all(
    classes.map(nafClass => {
      const level = levels.find(({ classId }) => classId === nafClass.id);

      return prisma.nafClass.upsert({
        where: { id: nafClass.id },
        update: {
          title: nafClass.title,
          group: {
            connect: { id: level?.groupId }
          }
        },
        create: {
          id: nafClass.id,
          title: nafClass.title,
          group: {
            connect: { id: level?.groupId }
          }
        }
      });
    })
  );

  await Promise.all(
    codes.map(code => {
      const level = levels.find(({ codeId }) => codeId === code.id);

      return prisma.nafCode.upsert({
        where: { id: code.id },
        update: {
          title: code.title,
          class: {
            connect: { id: level?.classId }
          }
        },
        create: {
          id: code.id,
          title: code.title,
          class: {
            connect: { id: level?.classId }
          }
        }
      });
    })
  );
};

import Form from 'next/form';
import { redirect } from 'next/navigation';
import { LuPencil } from 'react-icons/lu';

import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { db } from 'helpers/db';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'components/ui/table';

export default async function WorkflowsActions() {
  const actions = await db.action.findMany({
    select: {
      id: true,
      code: true,
      description: true,
      type: true,
      isPublished: true
    },
    orderBy: {
      createdAt: 'desc' // Trier par date de création par exemple
    }
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">Liste des Actions</h1>
      <Table>
        <TableCaption>
          Liste des actions configurées dans le système.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead></TableHead>
            {/* Ajoutez d'autres en-têtes si nécessaire, par ex. pour des boutons d'action */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map(action => (
            <TableRow key={action.id}>
              <TableCell className="font-medium">{action.code}</TableCell>
              <TableCell>{action.description || '-'}</TableCell>
              <TableCell>{action.type}</TableCell>
              <TableCell>
                <Form
                  action={async () => {
                    'use server';

                    await db.action.update({
                      where: { id: action.id },
                      data: {
                        isPublished: !action.isPublished
                      }
                    });

                    redirect(`/workflows/actions`);
                  }}
                >
                  <Button variant="ghost" size="icon" type="submit">
                    <input type="hidden" name="id" value={action.id} />
                    <Switch checked={action.isPublished} name="isPublished" />
                  </Button>
                </Form>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <LuPencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {actions.length === 0 && (
        <p className="text-muted-foreground mt-6 text-center">
          Aucune action trouvée.
        </p>
      )}
    </div>
  );
}

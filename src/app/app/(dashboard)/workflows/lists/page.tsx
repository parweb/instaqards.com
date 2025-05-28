import { LuPencil, LuPlus } from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import ListsMutateModal from 'components/modal/mutate-list';
import { db } from 'helpers/db';

export default async function WorkflowsLists() {
  const lists = await db.list.findMany({
    include: { contacts: true, owners: true },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ModalButton
          label={
            <>
              <LuPlus /> Add List
            </>
          }
        >
          <ListsMutateModal />
        </ModalButton>
      </div>

      <div className="flex flex-col gap-4">
        {lists.map(list => (
          <div
            key={list.id}
            className="flex items-center justify-between gap-4 rounded-md border p-4"
          >
            <div className="flex aspect-square w-15 items-center justify-center rounded-md border p-4">
              {list.contacts.length}
            </div>

            <div className="flex-1">
              <div className="font-medium">{list.title}</div>
              <div className="text-muted-foreground">{list.description}</div>
            </div>

            <div>
              <ModalButton label={<LuPencil />}>
                <ListsMutateModal list={list} />
              </ModalButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

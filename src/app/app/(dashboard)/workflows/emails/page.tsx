import { LuPencil, LuPlus } from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import EmailsMutateModal from 'components/modal/mutate-email';
import { db } from 'helpers/db';

export default async function WorkflowsEmails() {
  const emails = await db.email.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      design: true,
      subject: true
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ModalButton
          label={
            <>
              <LuPlus /> Add Email
            </>
          }
        >
          <EmailsMutateModal />
        </ModalButton>
      </div>

      <div className="flex flex-col gap-4">
        {emails.map(email => (
          <div
            key={email.id}
            className="flex items-center justify-between gap-4 rounded-md border p-4"
          >
            {/* <div className="aspect-square w-15 border rounded-md p-4 flex items-center justify-center">
              {email.list.contacts.length}
            </div> */}

            <div className="flex-1">
              <div className="font-medium">{email.title}</div>
              <div className="text-muted-foreground">{email.description}</div>
            </div>

            <div className="flex items-center gap-2">
              <ModalButton label={<LuPencil />}>
                <EmailsMutateModal email={email} />
              </ModalButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

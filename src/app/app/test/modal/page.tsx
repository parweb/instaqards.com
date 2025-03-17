'use client';

import { BlockTypes } from 'components/editor/form/BlockTypes';
import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';

export default function TestModalPage() {
  const modal = useModal();

  return (
    <div className="text-center">
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      <div className="p-8">
        <Button
          onClick={() =>
            modal?.show(
              <div className="flex flex-col space-y-4 p-5 md:p-10">
                <h2 className="font-cal text-2xl">Create a block</h2>

                <BlockTypes
                  onClick={({ type, id }) => console.log({ type, id })}
                />
              </div>
            )
          }
        >
          go
        </Button>
      </div>
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
      hello <br />
    </div>
  );
}

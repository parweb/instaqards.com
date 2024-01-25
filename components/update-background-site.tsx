'use client';

import { Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { updateSite } from '@/lib/actions';

const UpdateBackgroundSite = ({ siteId }: { siteId: Site['id'] }) => {
  const router = useRouter();

  return (
    <form
      action={async (data: FormData) => {
        const res = await updateSite(data, siteId, 'background');

        if (res.error) {
          toast.error(res.error);
        } else {
          va.track('Update site', { id: siteId });

          router.refresh();
          toast.success(`Site updated!`);
        }
      }}
      className="flex flex-col items-center bg-black/70 text-white p-10 pointer-events-none rounded-md"
    >
      <div>Click HERE</div>
      <div>or</div>
      <div>Drag & drop an image or a video</div>

      <input type="file" name="background" />

      <button>test</button>
    </form>
  );
};

export default UpdateBackgroundSite;

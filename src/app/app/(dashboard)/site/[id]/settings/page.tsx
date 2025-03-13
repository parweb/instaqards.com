import Form from 'components/form';
import DeleteSiteForm from 'components/form/delete-site-form';
import { db } from 'helpers/db';
import { updateSite } from 'lib/actions';
import { getSession } from 'lib/auth';

export default async function SiteSettingsIndex({
  params
}: {
  params: { id: string };
}) {
  const session = await getSession();

  const data = await db.site.findUnique({
    where: {
      id: decodeURIComponent(params.id)
    }
  });

  const users =
    session?.user.role === 'ADMIN'
      ? await db.user.findMany({
          select: {
            id: true,
            name: true,
            email: true
          }
        })
      : [];

  return (
    <div className="flex flex-col space-y-6">
      {session?.user.role === 'ADMIN' && (
        <Form
          title="Change owner"
          description="Change the owner of the site."
          inputAttrs={{
            name: 'userId',
            type: 'select',
            defaultValue: data?.userId ?? '',
            placeholder: 'Select a user',
            options: users.map(user => ({
              id: user.id,
              name: `${user.name}${user.email ? ` (${user.email})` : ''}`
            }))
          }}
          handleSubmit={
            updateSite as <T>(
              data: FormData,
              id: string,
              name: string
            ) => Promise<T | { error?: string }>
          }
          helpText=""
        />
      )}

      <Form
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: 'name',
          type: 'text',
          defaultValue: data?.name ?? '',
          placeholder: 'My Awesome Site',
          maxLength: 32
        }}
        handleSubmit={
          updateSite as <T>(
            data: FormData,
            id: string,
            name: string
          ) => Promise<T | { error?: string }>
        }
      />

      <Form
        title="Description"
        description="The description of your site. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: 'description',
          type: 'text',
          defaultValue: data?.description ?? '',
          placeholder: 'A blog about really interesting things.'
        }}
        handleSubmit={
          updateSite as <T>(
            data: FormData,
            id: string,
            name: string
          ) => Promise<T | { error?: string }>
        }
      />

      <DeleteSiteForm siteName={data?.name ?? ''} />
    </div>
  );
}

import { UserRole } from '@prisma/client';

import Form from 'components/form';
import DeleteSiteForm from 'components/form/delete-site-form';
import { db } from 'helpers/db';
import { updateSite } from 'lib/actions';
import { getAuth } from 'lib/auth';

export default async function SiteSettingsIndex(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [auth, site] = await Promise.all([
    getAuth(),
    db.site.findUnique({
      select: {
        name: true,
        description: true,
        userId: true
      },
      where: {
        id: decodeURIComponent(params.id)
      }
    })
  ]);

  const users = ([UserRole.ADMIN] as UserRole[]).includes(
    auth.role ?? UserRole.USER
  )
    ? await db.user.findMany({
        where: {
          bounced: { lte: 0 }
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })
    : await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true
        },
        where: {
          bounced: { lte: 0 },
          OR: [{ refererId: auth.id }, { id: auth.id }]
        }
      });

  return (
    <div className="flex flex-col space-y-6">
      {([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
        auth.role ?? UserRole.USER
      ) && (
        <Form
          title="Change owner"
          description="Change the owner of the site."
          inputAttrs={{
            name: 'userId',
            type: 'select',
            defaultValue: site?.userId ?? '',
            placeholder: 'Select a user',
            options: users.map(user => ({
              id: user.id,
              name: `${user.name}${user.email ? ` (${user.email})` : ''}`
            }))
          }}
          // @ts-expect-error
          handleSubmit={updateSite}
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
          defaultValue: site?.name ?? '',
          placeholder: 'My Awesome Site',
          maxLength: 32
        }}
        // @ts-expect-error
        handleSubmit={updateSite}
      />

      <Form
        title="Description"
        description="The description of your site. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: 'description',
          type: 'text',
          defaultValue: site?.description ?? '',
          placeholder: 'A blog about really interesting things.'
        }}
        // @ts-expect-error
        handleSubmit={updateSite}
      />

      <DeleteSiteForm siteName={site?.name ?? ''} />
    </div>
  );
}

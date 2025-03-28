'use server';

import { currentRole } from 'helpers/auth';
import { translate } from 'helpers/translate';

export const admin = async () => {
  const role = await currentRole();

  if (role === 'ADMIN') {
    return { success: await translate('actions.admin.success') };
  }

  return { error: await translate('actions.admin.error') };
};

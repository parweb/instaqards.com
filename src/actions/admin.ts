'use server';

import { currentRole } from 'helpers/auth';
import { translate } from 'helpers/translate';

export const admin = async () => {
  const role = await currentRole();

  if (role === 'ADMIN') {
    return { success: translate('actions.admin.success') };
  }

  return { error: translate('actions.admin.error') };
};

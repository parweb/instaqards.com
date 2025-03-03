import {
  adminAc,
  createAccessControl,
  memberAc,
  ownerAc
} from 'better-auth/plugins/access';

const crudl = ['create', 'read', 'update', 'delete', 'list'] as const;

const statements = {
  organization: [...crudl] as const,
  member: [...crudl, 'updateRole'] as const,
  invitation: [...crudl, 'cancel', 'resend'] as const,
  subscription: [...crudl, 'update'] as const,
  'page.home': ['read'] as const
} as const;

export const ac = createAccessControl(statements);

export const member = ac.newRole({
  ...memberAc.statements,
  organization: ['read'],
  member: ['read'],
  invitation: [],
  'page.home': ['read']
});

export const admin = ac.newRole({
  ...adminAc.statements,
  organization: ['read', 'update'],
  member: ['create', 'delete', 'updateRole'],
  invitation: ['create', 'cancel'],
  'page.home': ['read']
});

export const owner = ac.newRole({
  ...ownerAc.statements,
  organization: ['read', 'update', 'delete'],
  member: ['create', 'delete', 'updateRole'],
  invitation: ['create', 'cancel', 'resend'],
  subscription: ['read', 'update'],
  'page.home': ['read']
});

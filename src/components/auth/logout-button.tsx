'use client';

import { signOut } from 'lib/auth/client';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    signOut();
  };

  return (
    <span
      onClick={onClick}
      className="cursor-pointer"
      onKeyDown={e => {
        if (e.key === 'Enter') onClick();
      }}
    >
      {children}
    </span>
  );
};

'use client';

import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import { Button, ButtonProps } from 'components/ui/button';

export default function ModalButton({
  children,
  label,
  ...props
}: ButtonProps & {
  children: ReactNode;
  label: ReactNode;
}) {
  const modal = useModal();

  return (
    <Button type="button" onClick={() => modal?.show(children)} {...props}>
      {label}
    </Button>
  );
}

'use client';

import { DownloadIcon } from 'lucide-react';

import { Button } from 'components/ui/button';

export const DownloadButton = ({ src }: { src: string }) => {
  // force download
  return (
    <Button
      onClick={() => {
        const a = document.createElement('a');
        a.href = src;
        a.download = src;
        a.click();
      }}
      size="icon"
    >
      <DownloadIcon />
    </Button>
  );
};

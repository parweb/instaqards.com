'use client';

import { Link } from '@prisma/client';
import { motion } from 'framer-motion';

import DeleteLinkButton from 'components/delete-link-button';
import UpdateLinkModal from 'components/modal/update-link';
import UpdateLinkButton from 'components/update-link-button';
import { cn } from 'lib/utils';

const LinkUpdate = (link: Link) => {
  return (
    <UpdateLinkButton>
      <UpdateLinkModal {...link} />
    </UpdateLinkButton>
  );
};

const LinkDelete = (link: Link) => {
  return <DeleteLinkButton {...link} />;
};

const LinkItem = (link: Link) => {
  if (link.type === 'main') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group flex flex-1 items-center gap-2 relative"
      >
        <a
          className={cn(
            'transition-all',
            'border border-white/90 rounded-md p-3 text-white/90 w-full text-center',
            'hover:bg-white hover:text-black'
          )}
        >
          {link.label}
        </a>

        <div className="absolute right-10 flex gap-2 items-center p-2 transition-all opacity-0 group-hover:opacity-100 group-hover:right-0">
          <LinkUpdate {...link} />
          <LinkDelete {...link} />
        </div>
      </motion.div>
    );
  }

  if (link.type === 'social') {
    return (
      <div className="group flex flex-col flex-1 items-center gap-2 relative">
        <div className="flex gap-2 absolute items-center p-2 transition-all opacity-0 group-hover:opacity-100 bottom-[100%]">
          <LinkUpdate {...link} />
          <LinkDelete {...link} />
        </div>
        <a target="_blank">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={cn(
              link.label === 'facebook' && 'h-[65px]',
              link.label !== 'facebook' && 'h-[50px]',
              'object-contain transition-all hover:scale-125'
            )}
            src={link.logo!}
            alt={link.label}
          />
        </a>
      </div>
    );
  }

  return <></>;
};

export default LinkItem;

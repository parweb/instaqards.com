import { cn } from 'lib/utils';

export const Wrapper = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <main
      className={cn(
        'relative flex-1 self-stretch items-center flex flex-col',
        className
      )}
    >
      {children}
    </main>
  );
};

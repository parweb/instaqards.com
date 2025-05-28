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
        'relative flex flex-1 flex-col items-center self-stretch',
        className
      )}
    >
      {children}
    </main>
  );
};

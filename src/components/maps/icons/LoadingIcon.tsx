import { LuLoader } from 'react-icons/lu';

const LoadingIcon = () => {
  return (
    <LuLoader className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 animate-spin" />
  );
};

export default LoadingIcon;

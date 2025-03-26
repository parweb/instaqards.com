import { Loader2 } from 'lucide-react';

const LoadingIcon = () => {
  return (
    <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 animate-spin" />
  );
};

export default LoadingIcon;

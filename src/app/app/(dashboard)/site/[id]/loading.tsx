import PlaceholderCard from 'components/placeholder-card';

export default function Loading() {
  return (
    <>
      <div className="h-10 w-48 animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: shut up
          <PlaceholderCard key={index} />
        ))}
      </div>
    </>
  );
}

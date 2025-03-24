export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative flex-1 self-stretch items-center flex flex-col">
      {children}
    </main>
  );
};

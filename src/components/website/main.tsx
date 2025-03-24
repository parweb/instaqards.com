export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-1 self-stretch items-center justify-center">
      <div className="flex flex-col gap-10 flex-1">{children}</div>
    </main>
  );
};

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="absolute inset-0 flex flex-col px-5 py-10 flex-1 self-stretch overflow-y-auto">
      <div className="relative flex flex-col items-center m-auto w-full max-w-2xl gap-20 justify-between flex-1">
        {children}
      </div>
    </section>
  );
};

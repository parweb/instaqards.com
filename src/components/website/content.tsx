export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="absolute inset-0 flex flex-1 flex-col self-stretch overflow-y-auto px-5 py-10">
      <div className="relative m-auto flex w-full max-w-xl flex-1 flex-col items-center justify-between gap-20">
        {children}
      </div>
    </section>
  );
};

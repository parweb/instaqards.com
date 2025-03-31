import { Header } from './home/section/header';

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Header />

      {children}
    </div>
  );
}

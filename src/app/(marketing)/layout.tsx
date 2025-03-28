import { Header } from './home/section/header';

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Header />

      {children}
    </div>
  );
}

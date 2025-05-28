'use client';

export const ClusterIcon = ({
  count,
  colors
}: {
  count: number;
  colors: any;
}) => (
  <div className="relative flex h-14 w-14 items-center justify-center">
    <div className="absolute inset-0 -rotate-8 transform rounded-full bg-white shadow-2xl transition-all duration-500 ease-out"></div>
    <div
      className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to} rotate-8 transform rounded-full shadow-2xl transition-all duration-500 ease-out`}
    ></div>
    <div
      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-3 bg-white ${colors.border} shadow-lg transition-all duration-500 ease-out`}
    >
      <span className={`${colors.text} text-lg font-bold`}>{count}</span>
    </div>
  </div>
);

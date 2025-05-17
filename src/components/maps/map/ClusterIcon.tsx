'use client';

export const ClusterIcon = ({
  count,
  colors
}: {
  count: number;
  colors: any;
}) => (
  <div className="relative flex items-center justify-center w-14 h-14">
    <div className="absolute inset-0 bg-white rounded-full shadow-2xl transform -rotate-8 transition-all duration-500 ease-out"></div>
    <div
      className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to} rounded-full shadow-2xl transform rotate-8 transition-all duration-500 ease-out`}
    ></div>
    <div
      className={`relative flex items-center justify-center w-12 h-12 bg-white rounded-full border-3 ${colors.border} shadow-lg transition-all duration-500 ease-out`}
    >
      <span className={`${colors.text} font-bold text-lg`}>{count}</span>
    </div>
  </div>
);

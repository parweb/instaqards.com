'use client';

export const MarkerIcon = () => (
  <div
    className="group relative isolate select-none"
    style={{ width: '48px', height: '64px' }}
  >
    <div className="absolute top-0 left-0 h-12 w-12 scale-[1.2] transform rounded-full bg-purple-400/10 blur-md transition-transform duration-500 group-hover:scale-[1.25]"></div>

    <div className="absolute top-0 left-0 z-10 h-12 w-12 transition-all duration-500 group-hover:scale-105">
      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-300/40 to-purple-700/40 opacity-80 blur-md transition-opacity duration-500 group-hover:opacity-100"></div>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-purple-400 to-purple-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_12px_rgba(90,20,150,0.4)] backdrop-blur-sm transition-all duration-500 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_15px_rgba(90,20,150,0.5)]">
        <div className="absolute -top-6 -left-6 h-6 w-[150%] rotate-45 transform bg-white/40 blur-sm transition-transform duration-1000 group-hover:translate-x-1 group-hover:translate-y-1"></div>
        <div className="absolute flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-white/90 to-white/60 shadow-[inset_0_-2px_5px_rgba(0,0,0,0.1),0_2px_5px_rgba(255,255,255,0.4)] backdrop-blur-md transition-all duration-300 group-hover:h-8 group-hover:w-8">
          <div className="absolute inset-0 rounded-full bg-white/5 shadow-[inset_0_0_15px_5px_rgba(139,92,246,0.15)]"></div>
          <div className="absolute top-[20%] left-[20%] h-1 w-2 rotate-[-20deg] rounded-full bg-white/90 blur-[0.5px]"></div>
          <div className="absolute top-[30%] left-[30%] h-1 w-1 rounded-full bg-white/80 blur-[0.2px]"></div>
        </div>
      </div>
    </div>

    <div
      className="absolute top-[44px] left-1/2 z-0 h-4.5 w-7"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div className="absolute bottom-0 left-1/2 h-1 w-4 -translate-x-1/2 transform rounded-full bg-black/15 blur-[2px] transition-all duration-500 group-hover:w-5"></div>
      <div className="absolute h-full w-full">
        <div
          className="h-full w-full bg-gradient-to-b from-purple-400 to-purple-900 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_2px_4px_rgba(90,20,150,0.3)]"
          style={{
            clipPath: 'polygon(50% 100%, 20% 0, 80% 0)',
            borderRadius: '2px 2px 40% 40% / 2px 2px 8% 8%'
          }}
        ></div>
        <div
          className="absolute top-0 left-1/2 h-[50%] w-[60%] -translate-x-1/2 transform bg-gradient-to-b from-white/40 to-white/5"
          style={{
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            borderRadius: '40% 40% 0 0'
          }}
        ></div>
        <div className="absolute top-0 left-[calc(20%+1px)] h-full w-[1px] bg-purple-300/30 blur-[0.5px]"></div>
        <div className="absolute top-0 right-[calc(20%+1px)] h-full w-[1px] bg-purple-300/30 blur-[0.5px]"></div>
      </div>
    </div>
  </div>
);

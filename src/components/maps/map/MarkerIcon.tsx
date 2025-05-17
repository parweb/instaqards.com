'use client';

export const MarkerIcon = () => (
  <div
    className="isolate relative group select-none"
    style={{ width: '48px', height: '64px' }}
  >
    <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-purple-400/10 blur-md transform scale-[1.2] group-hover:scale-[1.25] transition-transform duration-500"></div>

    <div className="z-10 absolute left-0 top-0 w-12 h-12 group-hover:scale-105 transition-all duration-500">
      <div className="absolute -inset-1 bg-gradient-to-br from-purple-300/40 to-purple-700/40 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 border border-white/20 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_12px_rgba(90,20,150,0.4)] overflow-hidden flex items-center justify-center group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_15px_rgba(90,20,150,0.5)] transition-all duration-500">
        <div className="absolute -top-6 -left-6 w-[150%] h-6 bg-white/40 rotate-45 blur-sm transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-1000"></div>
        <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-md border border-white/40 shadow-[inset_0_-2px_5px_rgba(0,0,0,0.1),0_2px_5px_rgba(255,255,255,0.4)] group-hover:w-8 group-hover:h-8 transition-all duration-300 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/5 shadow-[inset_0_0_15px_5px_rgba(139,92,246,0.15)]"></div>
          <div className="absolute top-[20%] left-[20%] w-2 h-1 rounded-full bg-white/90 rotate-[-20deg] blur-[0.5px]"></div>
          <div className="absolute top-[30%] left-[30%] w-1 h-1 rounded-full bg-white/80 blur-[0.2px]"></div>
        </div>
      </div>
    </div>

    <div
      className="z-0 absolute left-1/2 top-[44px] w-7 h-4.5"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div className="absolute w-4 h-1 bg-black/15 rounded-full blur-[2px] left-1/2 bottom-0 transform -translate-x-1/2 group-hover:w-5 transition-all duration-500"></div>
      <div className="absolute w-full h-full">
        <div
          className="w-full h-full bg-gradient-to-b from-purple-400 to-purple-900 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_2px_4px_rgba(90,20,150,0.3)]"
          style={{
            clipPath: 'polygon(50% 100%, 20% 0, 80% 0)',
            borderRadius: '2px 2px 40% 40% / 2px 2px 8% 8%'
          }}
        ></div>
        <div
          className="absolute w-[60%] h-[50%] top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-white/40 to-white/5"
          style={{
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            borderRadius: '40% 40% 0 0'
          }}
        ></div>
        <div className="absolute h-full w-[1px] top-0 left-[calc(20%+1px)] bg-purple-300/30 blur-[0.5px]"></div>
        <div className="absolute h-full w-[1px] top-0 right-[calc(20%+1px)] bg-purple-300/30 blur-[0.5px]"></div>
      </div>
    </div>
  </div>
);

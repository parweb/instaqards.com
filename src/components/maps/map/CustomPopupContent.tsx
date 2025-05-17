'use client';

const CustomPopupContent = ({
  marker
}: {
  marker: { id: string; position: [number, number]; name?: string };
}) => (
  <div className="transform transition-all duration-300 popup-content">
    <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 backdrop-filter backdrop-blur-lg bg-white/10">
      <div className="absolute -inset-[100%] bg-gradient-to-r from-purple-600/20 via-pink-600/0 to-blue-600/20 animate-[gradient-shift_8s_ease-in-out_infinite]"></div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-2xl opacity-80"></div>
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-2xl opacity-80"></div>

      <div className="relative backdrop-filter backdrop-blur-md bg-white/70 overflow-hidden flex flex-col">
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 animate-[gradient-shift_3s_ease-in-out_infinite]"></div>

        <div className="px-5 py-4 flex items-start">
          <div className="relative flex-shrink-0 mr-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/60 to-purple-800/60 blur-sm transform scale-[1.15] opacity-70"></div>

            <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-800 rounded-full flex items-center justify-center shadow-lg border border-white/30">
              <span className="text-white text-sm font-bold tracking-wide">
                {marker.name?.charAt(0) || '?'}
              </span>
              <div className="absolute top-[20%] left-[20%] w-2 h-1 rounded-full bg-white/80 rotate-[-20deg] blur-[0.5px]"></div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-purple-900 tracking-tight leading-tight mb-0.5 group-hover:text-purple-700 transition-colors duration-300">
              {marker.name || ''}
            </h3>

            <div className="flex items-center text-xs text-purple-700/80">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                ></path>
              </svg>

              <span>Explorer ce lieu</span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-4 text-sm text-purple-800/90 leading-snug">
          <p>Cliquez pour découvrir ce lieu et ses informations détaillées.</p>
        </div>

        <div className="px-5 pb-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {/* <button
          className="group relative px-4 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-purple-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white/50 overflow-hidden"
          data-zoom-center={`${marker.position[0]},${marker.position[1]}`}
        >
          <span className="relative z-10">Zoomer et centrer ici</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="absolute -inset-[100%] blur-md bg-gradient-to-r from-purple-400/0 via-purple-400/40 to-purple-400/0 group-hover:animate-[shine_1.5s_ease-out]"></div>
        </button> */}

          <button className="group relative px-4 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-purple-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white/50 overflow-hidden">
            <span className="relative z-10">Voir plus</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute -inset-[100%] blur-md bg-gradient-to-r from-purple-400/0 via-purple-400/40 to-purple-400/0 group-hover:animate-[shine_1.5s_ease-out]"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

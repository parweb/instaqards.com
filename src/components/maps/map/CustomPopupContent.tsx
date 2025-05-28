'use client';

const CustomPopupContent = ({
  marker
}: {
  marker: { id: string; position: [number, number]; name?: string };
}) => (
  <div className="popup-content transform transition-all duration-300">
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-lg backdrop-filter">
      <div className="absolute -inset-[100%] animate-[gradient-shift_8s_ease-in-out_infinite] bg-gradient-to-r from-purple-600/20 via-pink-600/0 to-blue-600/20"></div>
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 opacity-80 blur-2xl"></div>
      <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-80 blur-2xl"></div>

      <div className="relative flex flex-col overflow-hidden bg-white/70 backdrop-blur-md backdrop-filter">
        <div className="h-1.5 w-full animate-[gradient-shift_3s_ease-in-out_infinite] bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600"></div>

        <div className="flex items-start px-5 py-4">
          <div className="relative mr-4 flex-shrink-0">
            <div className="absolute inset-0 scale-[1.15] transform rounded-full bg-gradient-to-br from-purple-600/60 to-purple-800/60 opacity-70 blur-sm"></div>

            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-purple-500 to-purple-800 shadow-lg">
              <span className="text-sm font-bold tracking-wide text-white">
                {marker.name?.charAt(0) || '?'}
              </span>
              <div className="absolute top-[20%] left-[20%] h-1 w-2 rotate-[-20deg] rounded-full bg-white/80 blur-[0.5px]"></div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="mb-0.5 text-base leading-tight font-bold tracking-tight text-purple-900 transition-colors duration-300 group-hover:text-purple-700">
              {marker.name || ''}
            </h3>

            <div className="flex items-center text-xs text-purple-700/80">
              <svg
                className="mr-1 h-3 w-3"
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

        <div className="px-5 pb-4 text-sm leading-snug text-purple-800/90">
          <p>Cliquez pour découvrir ce lieu et ses informations détaillées.</p>
        </div>

        <div className="flex flex-col gap-2 px-5 pb-4 sm:flex-row sm:justify-end">
          {/* <button
          className="group relative px-4 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-purple-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white/50 overflow-hidden"
          data-zoom-center={`${marker.position[0]},${marker.position[1]}`}
        >
          <span className="relative z-10">Zoomer et centrer ici</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="absolute -inset-[100%] blur-md bg-gradient-to-r from-purple-400/0 via-purple-400/40 to-purple-400/0 group-hover:animate-[shine_1.5s_ease-out]"></div>
        </button> */}

          <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-1.5 text-xs font-medium text-white shadow-md transition-all duration-300 hover:from-purple-500 hover:to-purple-700 hover:shadow-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white/50 focus:outline-none">
            <span className="relative z-10">Voir plus</span>
            <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
            <div className="absolute -inset-[100%] bg-gradient-to-r from-purple-400/0 via-purple-400/40 to-purple-400/0 blur-md group-hover:animate-[shine_1.5s_ease-out]"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export function Road() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          overflow: hidden;
        }

        div,
        div:before {
          --s: 56px; /* control the size */
          --g: 10px; /* control the gap */
          --c: #ecd078; /* first color */

          --_l:
            #0000 calc(33% - 0.866 * var(--g)),
            var(--c) calc(33.2% - 0.866 * var(--g)) 33%, #0000 34%;
          background:
            repeating-linear-gradient(var(--c) 0 var(--g), #0000 0 50%) 0
              calc(0.866 * var(--s) - var(--g) / 2),
            conic-gradient(
              from -150deg at var(--g) 50%,
              var(--c) 120deg,
              #0000 0
            ),
            linear-gradient(-120deg, var(--_l)),
            linear-gradient(-60deg, var(--_l)) #0b486b; /* second color */
          background-size: var(--s) calc(3.466 * var(--s));
          animation: p infinite 2s linear;
        }

        div:before {
          content: '';
          position: absolute;
          inset: 0;
          -webkit-mask: linear-gradient(#000 50%, #0000 0) 0
            calc(0.866 * var(--s)) / 100% calc(3.466 * var(--s));
          animation-direction: reverse;
        }

        @keyframes p {
          to {
            background-position-x: calc(-1 * var(--s));
          }
        }
      `}</style>
    </div>
  );
}

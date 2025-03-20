export function Octagon() {
  return (
    <div>
      <style jsx>{`
        @property --a {
          syntax: '<angle>';
          inherits: true;
          initial-value: 0deg;
        }
        @property --p {
          syntax: '<percentage>';
          inherits: true;
          initial-value: 0%;
        }
        @property --c1 {
          syntax: '<color>';
          inherits: true;
          initial-value: #000;
        }
        @property --c2 {
          syntax: '<color>';
          inherits: true;
          initial-value: #000;
        }

        div {
          position: absolute;
          inset: 0;

          --s: 80px;
          --_g: #0000, var(--c1) 2deg calc(var(--a) - 2deg), #0000 var(--a);
          background:
            conic-gradient(
              from calc(-45deg - var(--a) / 2) at top var(--p) left var(--p),
              var(--_g)
            ),
            conic-gradient(
              from calc(-45deg - var(--a) / 2) at top var(--p) left var(--p),
              var(--_g)
            ),
            conic-gradient(
              from calc(45deg - var(--a) / 2) at top var(--p) right var(--p),
              var(--_g)
            ),
            conic-gradient(
              from calc(45deg - var(--a) / 2) at top var(--p) right var(--p),
              var(--_g)
            ),
            conic-gradient(
              from calc(-135deg - var(--a) / 2) at bottom var(--p) left var(--p),
              var(--_g)
            ),
            conic-gradient(
              from calc(-135deg - var(--a) / 2) at bottom var(--p) left var(--p),
              var(--_g)
            ),
            conic-gradient(
              from calc(135deg - var(--a) / 2) at bottom var(--p) right var(--p),
              var(--_g)
            ),
            conic-gradient(
                from calc(135deg - var(--a) / 2) at bottom var(--p) right
                  var(--p),
                var(--_g)
              )
              var(--c2);
          background-size: calc(2 * var(--s)) calc(2 * var(--s));
          animation: m 2s infinite alternate linear;
        }

        @keyframes m {
          0%,
          15% {
            --a: 135deg;
            --p: 20%;
            --c1: #3b8183;
            --c2: #fad089;
            background-position:
              0 0,
              var(--s) var(--s);
          }
          45%,
          50% {
            --a: 90deg;
            --p: 25%;
            --c1: #3b8183;
            --c2: #fad089;
            background-position:
              0 0,
              var(--s) var(--s);
          }
          50.01%,
          55% {
            --a: 90deg;
            --p: 25%;
            --c2: #3b8183;
            --c1: #fad089;
            background-position:
              var(--s) 0,
              0 var(--s);
          }
          85%,
          100% {
            --a: 135deg;
            --p: 20%;
            --c2: #3b8183;
            --c1: #fad089;
            background-position:
              var(--s) 0,
              0 var(--s);
          }
        }
      `}</style>
    </div>
  );
}

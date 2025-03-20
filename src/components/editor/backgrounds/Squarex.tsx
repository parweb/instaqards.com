export function Squarex() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --s: 60px;
          --c: #542437;

          --_g:
            #0000 calc(-650% / 13) calc(50% / 13), var(--c) 0 calc(100% / 13),
            #0000 0 calc(150% / 13), var(--c) 0 calc(200% / 13),
            #0000 0 calc(250% / 13), var(--c) 0 calc(300% / 13);
          --_g0: repeating-linear-gradient(45deg, var(--_g));
          --_g1: repeating-linear-gradient(-45deg, var(--_g));
          background:
            var(--_g0),
            var(--_g0) var(--s) var(--s),
            var(--_g1),
            var(--_g1) var(--s) var(--s) #c02942;
          background-size: calc(2 * var(--s)) calc(2 * var(--s));
        }
      `}</style>
    </div>
  );
}

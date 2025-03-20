export function Mosaic() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --s: 8em;
          --o: 1px;
          --l:
            transparent calc(50% - var(--o)),
            #fff calc(50% - var(--o)) calc(50% + var(--o)),
            transparent calc(50% + var(--o));

          background:
            linear-gradient(-45deg, var(--l)),
            linear-gradient(45deg, var(--l)),
            repeating-conic-gradient(#123750 0% 12.5%, #bc4a33 0% 25%)
              calc(var(--s) * 0.5) calc(var(--s) * 0.5),
            conic-gradient(
                from 90deg at calc(2 * var(--o)) calc(2 * var(--o)),
                transparent 25%,
                #fff 0%
              )
              calc(-1 * var(--o)) calc(-1 * var(--o)),
            repeating-conic-gradient(
                from 45deg,
                #000 0% 25%,
                transparent 0% 50%
              )
              calc(var(--s) * 0.5) 0,
            repeating-conic-gradient(#fed475 0% 12.5%, #dc9d5c 0% 25%);

          background-size:
            calc(var(--s) * 0.5) calc(var(--s) * 0.5),
            calc(var(--s) * 0.5) calc(var(--s) * 0.5),
            var(--s) var(--s),
            calc(var(--s) * 0.5) calc(var(--s) * 0.5),
            var(--s) var(--s),
            var(--s) var(--s);

          background-blend-mode: normal, normal, lighten;
        }
      `}</style>
    </div>
  );
}

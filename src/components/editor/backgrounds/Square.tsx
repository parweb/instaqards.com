export function Square() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --u: 15px;
          --c1: #a29478;
          --c2: #616c7f;
          --c3: #414c66;
          --gp: 50% / calc(var(--u) * 10) calc(var(--u) * 7.8);
          --dg: 0 25%, #fff0 0 100%;
          --dr: from 45deg at;
          --dl: from -135deg at;
          --du: from -45deg at 50%;
          --dd: from 135deg at 50%;

          background:
            conic-gradient(var(--dr) 86% 62%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dr) 76% 62%, var(--c3) var(--dg)) var(--gp),
            conic-gradient(var(--dr) 74.5% 62%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dr) 65% 62%, var(--c2) var(--dg)) var(--gp),
            conic-gradient(var(--dr) 63.5% 62%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dr) 56% 62%, var(--c3) var(--dg)) var(--gp),
            conic-gradient(var(--dr) 54.5% 62%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dr) 50% 62%, var(--c2) var(--dg)) var(--gp),
            conic-gradient(var(--dl) 14% 62%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dl) 24% 62%, var(--c3) var(--dg)) var(--gp),
            conic-gradient(var(--dl) 25.5% 62%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dl) 35% 62%, var(--c2) var(--dg)) var(--gp),
            conic-gradient(var(--dl) 36.5% 62%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dl) 44% 62%, var(--c3) var(--dg)) var(--gp),
            conic-gradient(var(--dl) 45.5% 62%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dl) 50% 62%, var(--c2) var(--dg)) var(--gp),
            conic-gradient(var(--du) 19%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--du) 31%, var(--c3) var(--dg)) var(--gp),
            conic-gradient(var(--du) 33%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--du) 43.5%, var(--c2) var(--dg)) var(--gp),
            conic-gradient(var(--du) 45.5%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--du) 55%, var(--c3) var(--dg)) var(--gp),
            conic-gradient(var(--du) 57%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--du) 66%, var(--c2) var(--dg)) var(--gp),
            conic-gradient(var(--dd) 81%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dd) 69%, var(--c3) var(--dg)) var(--gp),
            conic-gradient(var(--dd) 67%, var(--c1) var(--dg)) var(--gp),
            conic-gradient(var(--dd) 58%, var(--c2) var(--dg)) var(--gp);
        }
      `}</style>
    </div>
  );
}

export function Leather() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --sz: 5px;
          --cd: 20deg;
          --c1: hsl(var(--cd) 81% 33%);
          --c2: hsl(var(--cd) 97% 25%);
          --c3: hsl(var(--cd) 100% 18%);
          --c4: hsl(var(--cd) 100% 13%);
          --ts: 50% / calc(var(--sz) * 18) calc(var(--sz) * 18);
          --cg:
            var(--c1) 22.5deg, var(--c2) 45deg, var(--c3) 67.5deg,
            var(--c4) 90deg, #fff0 0 100%;
          --hd: conic-gradient(from -45deg at 50% 50%, var(--cg)) var(--ts);
          --bt:
            var(--c2) calc(var(--sz) * 0.5),
            var(--c3) calc(var(--sz) * 0.6) calc(var(--sz) * 0.65),
            var(--c4) calc(calc(var(--sz) * 0.65) + 1px) calc(var(--sz) * 0.75),
            #0002 calc(var(--sz) * 0.85) calc(var(--sz) * 1),
            #fff0 calc(var(--sz) * 8.5) 100%;
          --bts:
            #f7b2b244 calc(var(--sz) * 0.05), #fff0 calc(var(--sz) * 0.65) 100%;
          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 49.25% 50.5%, var(--bts)) var(--ts),
            radial-gradient(circle at 99.25% 0.5%, var(--bts)) var(--ts),
            radial-gradient(circle at 99.25% 100.5%, var(--bts)) var(--ts),
            radial-gradient(circle at -0.75% 0.5%, var(--bts)) var(--ts),
            radial-gradient(circle at -0.75% 100.5%, var(--bts)) var(--ts),
            radial-gradient(circle at 50% 50%, var(--bt)) var(--ts),
            radial-gradient(circle at 100% 100%, var(--bt)) var(--ts),
            radial-gradient(circle at 100% 0%, var(--bt)) var(--ts),
            radial-gradient(circle at 0% 100%, var(--bt)) var(--ts),
            radial-gradient(circle at 0% 0%, var(--bt)) var(--ts),
            linear-gradient(
                45deg,
                #fff0 49%,
                var(--c1),
                var(--c2),
                var(--c3),
                #fff0 51%
              )
              var(--ts),
            linear-gradient(
                135deg,
                #fff0 49%,
                var(--c1),
                var(--c2),
                var(--c3),
                #fff0 51%
              )
              var(--ts),
            var(--hd),
            var(--hd),
            var(--hd),
            var(--hd),
            conic-gradient(from -45deg at 100% 100%, var(--cg)) var(--ts),
            conic-gradient(from -45deg at 0% 100%, var(--cg)) var(--ts),
            conic-gradient(from -45deg at 50% 150%, var(--cg)) var(--ts);
        }
      `}</style>
    </div>
  );
}

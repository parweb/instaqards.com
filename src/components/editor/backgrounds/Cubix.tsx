export function Cubix() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --u: 10px;
          --c1: #fbd163;
          --c2: #e4a228;
          --c3: #d68f2b;
          --c4: #4c302f;
          --gp: 50% / calc(var(--u) * 10) calc(var(--u) * 17.2);
          --bp: calc(var(--u) * -5) calc(var(--u) * -8.6);
          height: 100vh;
          --bg:
            conic-gradient(
                from 0deg at 76.75% 18.25%,
                var(--c4) 0 60deg,
                var(--c3) 0 120deg,
                var(--c1) 0 120deg,
                #fff0 0 360deg
              )
              var(--gp),
            conic-gradient(
                from -120deg at 23.5% 18.25%,
                var(--c3) 0 60deg,
                var(--c1) 0 120deg,
                #fff0 0 360deg
              )
              var(--gp),
            conic-gradient(
                from -32deg at 50% 25%,
                var(--c2) 0 64deg,
                #fff0 0 360deg
              )
              var(--gp),
            conic-gradient(
                from 0deg at 77% 33.25%,
                var(--c1) 0 120deg,
                #fff0 0 360deg
              )
              var(--gp),
            conic-gradient(
                from -120deg at 23% 33.25%,
                var(--c4) 0 120deg,
                #fff0 0 360deg
              )
              var(--gp),
            conic-gradient(
                from -60deg at 50% 42%,
                var(--c1) 0 60deg,
                var(--c4) 0 120deg,
                #fff0 0 360deg
              )
              var(--gp),
            conic-gradient(
                from -60deg at 73% 50%,
                var(--c3) 0 150deg,
                #fff0 0 360deg
              )
              var(--gp),
            conic-gradient(
                from -90deg at 27% 50%,
                var(--c3) 0 150deg,
                #fff0 0 360deg
              )
              var(--gp),
            conic-gradient(
                from -90deg at 50% 50%,
                var(--c4) 0 90deg,
                var(--c1) 0 180deg,
                #fff0 0 360deg
              )
              var(--gp);
          background: var(--bg), var(--bg);
          background-position:
            var(--bp),
            var(--bp),
            var(--bp),
            var(--bp),
            var(--bp),
            var(--bp),
            var(--bp),
            var(--bp),
            var(--bp),
            0 0,
            0 0,
            0 0,
            0 0,
            0 0,
            0 0,
            0 0,
            0 0,
            0 0;
        }
      `}</style>
    </div>
  );
}

export function Zagged() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --sz: 4px;
          --r1: #fd2e1a;
          --r2: #9a252a;
          --v1: #cfa5f1;
          --r1: #673ab7;
          --r2: #4c2b87;
          --v2: #aa79d5;
          --ts: 50% / calc(var(--sz) * 33) calc(var(--sz) * 28);

          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
          background:
            conic-gradient(
                from -296deg at 100% 59%,
                var(--v2) 0 133deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from -296deg at 85% 67%,
                var(--r2) 0 134.5deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from -296deg at 68% 77%,
                var(--v2) 0 137deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from -296deg at 55% 85%,
                var(--r2) 0 150deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from -248deg at 38% 77%,
                var(--v2) 0 97deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from -248deg at 15% 66%,
                var(--r2) 0 95deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from 207deg at 15% 66%,
                var(--v2) 0 84deg,
                var(--v1) 0 138deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from 23deg at 85% 12%,
                var(--v2) 0 34deg,
                var(--v1) 0 136deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from 22deg at 66% 27%,
                var(--r2) 0 34deg,
                var(--r1) 0 128deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from 17deg at 50% 40%,
                var(--v2) 0 39deg,
                var(--v1) 0 133deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from 31deg at 33% 26%,
                var(--r2) 0 94deg,
                var(--r1) 0 125deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from -57deg at 19% 15%,
                var(--r2) 0 90deg,
                var(--v2) 0 181deg,
                var(--v1) 0 217deg,
                var(--r1) 0 360deg,
                #fff0 0 100%
              )
              var(--ts);
        }
      `}</style>
    </div>
  );
}

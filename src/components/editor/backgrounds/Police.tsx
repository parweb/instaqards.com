export function Police() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --sz: 10px;
          --c1: #181818;
          --c2: #ffda07;
          --c3: #ffc107;
          --c4: #0006;
          --ts: 50% / calc(var(--sz) * 5) calc(var(--sz) * 10);

          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
          background:
            linear-gradient(180deg, var(--c4) 0 14%, #fff0 0 100%) var(--ts),
            conic-gradient(from 0deg at 0% 14%, var(--c1) 0 20deg, #fff0 0 100%)
              var(--ts),
            conic-gradient(
                from 20deg at 74% 50%,
                var(--c3) 0 70deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from 90deg at 50% 50%,
                var(--c1) 0 70deg,
                #fff0 0 100%
              )
              var(--ts),
            conic-gradient(
                from 90deg at 0% 50%,
                var(--c2) 0 70deg,
                var(--c1) 0 90deg,
                #fff0 0 100%
              )
              var(--ts),
            linear-gradient(
                110deg,
                var(--c3) 0 33%,
                var(--c1) 0 66%,
                var(--c2) 0 90%,
                black 0 100%
              )
              var(--ts);
        }
      `}</style>
    </div>
  );
}

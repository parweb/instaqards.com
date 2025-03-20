export function Honey() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --sz: 5px;
          --c0: #3a1b0f;
          --c1: #ffc56f;
          --c2: #d99838;
          --c3: #9b5e05;
          --ts: 50% / calc(var(--sz) * 12.8) calc(var(--sz) * 22);
          background:
            conic-gradient(
                from 120deg at 50% 86.5%,
                var(--c1) 0 120deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from 120deg at 50% 86.5%,
                var(--c1) 0 120deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from 120deg at 50% 74%,
                var(--c0) 0 120deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from 60deg at 60% 50%,
                var(--c1) 0 60deg,
                var(--c2) 0 120deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from 180deg at 40% 50%,
                var(--c3) 0 60deg,
                var(--c1) 0 120deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from 0deg at 90% 35%,
                var(--c0) 0 90deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from -90deg at 10% 35%,
                var(--c0) 0 90deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from 0deg at 90% 35%,
                var(--c0) 0 90deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from -90deg at 10% 35%,
                var(--c0) 0 90deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from -60deg at 50% 13.5%,
                var(--c1) 0 120deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from -60deg at 50% 13.5%,
                var(--c1) 0 120deg,
                #fff0 0 360deg
              )
              var(--ts),
            conic-gradient(
                from -60deg at 50% 41%,
                var(--c2) 0 60deg,
                var(--c3) 0 120deg,
                #fff0 0 360deg
              )
              var(--ts),
            var(--c0);
        }
      `}</style>
    </div>
  );
}

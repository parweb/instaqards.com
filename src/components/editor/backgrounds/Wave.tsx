export function Wave() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          --size: 100px;
          --yellow: #edae49;
          --dark-blue: #003d5b;
          --teal: #039486;

          background:
            radial-gradient(
              transparent 43%,
              var(--dark-blue) 44%,
              var(--dark-blue) 50%,
              transparent 51%,
              transparent 75%,
              var(--yellow) 76%,
              var(--yellow) 82%,
              var(--dark-blue) 83%
            ),
            radial-gradient(
              transparent 43%,
              var(--dark-blue) 44%,
              var(--dark-blue) 50%,
              var(--teal) 51%,
              var(--teal) 67%,
              transparent 68%,
              transparent 75%,
              var(--yellow) 76%,
              var(--yellow) 82%,
              var(--teal) 83%
            );
          background-size: var(--size) var(--size);
          background-position:
            0 0,
            calc(var(--size) / 2) calc(var(--size) / 2);
        }
      `}</style>
    </div>
  );
}

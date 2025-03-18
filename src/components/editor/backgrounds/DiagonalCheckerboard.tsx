export function DiagonalCheckerboard() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          background-color: #eee;
          background-image:
            linear-gradient(
              45deg,
              black 25%,
              transparent 25%,
              transparent 75%,
              black 75%,
              black
            ),
            linear-gradient(
              -45deg,
              black 25%,
              transparent 25%,
              transparent 75%,
              black 75%,
              black
            );
          background-size: 60px 60px;
        }
      `}</style>
    </div>
  );
}

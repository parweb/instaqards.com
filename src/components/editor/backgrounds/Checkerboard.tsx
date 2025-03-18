export function Checkerboard() {
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
              45deg,
              black 25%,
              transparent 25%,
              transparent 75%,
              black 75%,
              black
            );
          background-size: 60px 60px;
          background-position:
            0 0,
            30px 30px;
        }
      `}</style>
    </div>
  );
}

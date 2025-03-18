export function DiagonalStripes() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          background-color: gray;
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255, 255, 255, 0.5) 35px,
            rgba(255, 255, 255, 0.5) 70px
          );
        }
      `}</style>
    </div>
  );
}

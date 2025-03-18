export function VerticalStripes() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          background-color: gray;
          background-image: linear-gradient(
            90deg,
            transparent 50%,
            rgba(255, 255, 255, 0.5) 50%
          );
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}

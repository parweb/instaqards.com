export function Waves() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 100% 50%,
              transparent 20%,
              rgba(255, 255, 255, 0.3) 21%,
              rgba(255, 255, 255, 0.3) 34%,
              transparent 35%,
              transparent
            ),
            radial-gradient(
                circle at 0% 50%,
                transparent 20%,
                rgba(255, 255, 255, 0.3) 21%,
                rgba(255, 255, 255, 0.3) 34%,
                transparent 35%,
                transparent
              )
              0 -50px;
          background-color: slategray;
          background-size: 75px 100px;
        }
      `}</style>
    </div>
  );
}

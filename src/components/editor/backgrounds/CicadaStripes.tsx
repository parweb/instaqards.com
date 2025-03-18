export function CicadaStripes() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          background-color: #026873;
          background-image:
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.07) 50%,
              transparent 50%
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.13) 50%,
              transparent 50%
            ),
            linear-gradient(
              90deg,
              transparent 50%,
              rgba(255, 255, 255, 0.17) 50%
            ),
            linear-gradient(
              90deg,
              transparent 50%,
              rgba(255, 255, 255, 0.19) 50%
            );
          background-size: 13px, 29px, 37px, 53px;
        }
      `}</style>
    </div>
  );
}

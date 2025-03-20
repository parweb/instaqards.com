export function Maille() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          -webkit-backface-visibility: hidden;

          background-color: hsl(0, 0%, 18%);

          -webkit-background-size: 3px 3px;
          background-image:
            -webkit-linear-gradient(
              0deg,
              hsla(0, 0%, 0%, 0) 0,
              hsla(0, 0%, 10%, 1) 3px
            ),
            -webkit-linear-gradient(
                90deg,
                hsla(0, 0%, 0%, 0) 0,
                hsla(0, 0%, 10%, 1) 5px
              );

          background-image: -moz-linear-gradient(
            hsl(0, 0%, 11%),
            hsl(0, 0%, 11%)
          );
          background-image: -ms-linear-gradient(
            hsl(0, 0%, 11%),
            hsl(0, 0%, 11%)
          );
          background-image: -o-linear-gradient(
            hsl(0, 0%, 11%),
            hsl(0, 0%, 11%)
          );
        }
      `}</style>
    </div>
  );
}

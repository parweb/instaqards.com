export function Jelly() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          background-size: 60px 60px;
          background-color: hsla(320, 80%, 60%, 1);
          background-image:
            repeating-radial-gradient(
              hsla(320, 100%, 60%, 0.6) 0px,
              hsla(220, 100%, 60%, 0) 60%
            ),
            repeating-radial-gradient(
              hsla(330, 100%, 40%, 1) 12%,
              hsla(320, 80%, 60%, 1) 24px
            );
          animation: jelly 100.4s cubic-bezier(0.1, 0.4, 0.9, 0.6) infinite;
        }

        @keyframes jelly {
          from {
            background-size:
              60px 60px,
              24px 24px;
          }
          50% {
            background-size:
              120px 120px,
              100px 100px;
          }
          to {
            background-size:
              24px 24px,
              140px 140px;
          }
        }
      `}</style>
    </div>
  );
}

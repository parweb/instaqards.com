export function Lsd() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
                farthest-side at -33.33% 50%,
                #0000 52%,
                #ba0c2e 54% 57%,
                #0000 59%
              )
              0 calc(128px / 2),
            radial-gradient(
                farthest-side at 50% 133.33%,
                #0000 52%,
                #ba0c2e 54% 57%,
                #0000 59%
              )
              calc(128px / 2) 0,
            radial-gradient(
              farthest-side at 133.33% 50%,
              #0000 52%,
              #ba0c2e 54% 57%,
              #0000 59%
            ),
            radial-gradient(
              farthest-side at 50% -33.33%,
              #0000 52%,
              #ba0c2e 54% 57%,
              #0000 59%
            ),
            #ff0134;
          background-size:
            calc(128px / 4.667) 128px,
            128px calc(128px / 4.667);
        }
      `}</style>
    </div>
  );
}

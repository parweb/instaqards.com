export default function Shiny({ label = 'Press me' }: { label?: string }) {
  return (
    <button className="button-19" type="button">
      <span className="text">{label}</span>

      <style jsx>{`
        .button-19 {
          background:
            linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.13)),
            radial-gradient(
              90% 7% at 50% 8%,
              rgba(255, 255, 255, 0.47) 25%,
              rgba(255, 255, 255, 0) 50%
            ),
            #0053d0;
          border: 0;
          border-radius: 0.375em;
          box-shadow:
            0.2em 0.2em 0.5em rgba(0, 0, 0, 0.47),
            0 -0.1em 0 0.1em rgba(0, 0, 0, 0.27),
            0 0.1em 0 0.1em rgba(255, 255, 255, 0.27),
            -0.2em 0 0.2em #003f9d inset,
            0 0.2em 0.2em rgba(255, 255, 255, 0.27) inset,
            0.2em 0 0.2em rgba(255, 255, 255, 0.27) inset,
            0 -0.2em 0.2em #003f9d inset;
          color: #fff;
          cursor: pointer;
          margin: 0 auto;
          padding: 10px 20px;
          text-shadow: 0 0 0.2em rgba(255, 255, 255, 0.47);
          transition-property: box-shadow;
          -webkit-tap-highlight-color: transparent;
        }
        .button-19,
        .button-19 span {
          display: block;
          transition-duration: 0.1s;
          transition-timing-function: linear;
        }
        .button-19:focus,
        .button-19 span:focus {
          outline: none;
        }
        .button-19 span {
          transition-property: transform;
          will-change: transform;
        }
        .button-19:active {
          box-shadow:
            0 0 0 rgba(0, 0, 0, 0.47),
            0 -0.1em 0 0.1em rgba(0, 0, 0, 0.27),
            0 0.1em 0 0.1em rgba(255, 255, 255, 0.27),
            -0.2em 0 0.2em #002a6a inset,
            0 0.2em 0.2em rgba(0, 0, 0, 0.27) inset,
            0.2em 0 0.2em rgba(0, 0, 0, 0.27) inset,
            0 -0.2em 0.2em #002a6a inset;
        }
        .button-19:active span {
          transform: scale(0.95);
        }
        .button-19:focus {
          color: #9dc4ff;
          text-shadow: 0 0 0.2em rgba(157, 196, 255, 0.47);
        }
      `}</style>
    </button>
  );
}

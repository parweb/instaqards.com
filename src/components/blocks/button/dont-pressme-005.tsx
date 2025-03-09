export default function DontPressMe005({
  label = 'Press Me'
}: {
  label?: string;
}) {
  return (
    <button className="button-56" type="button">
      <span className="text">{label}</span>

      <style jsx>{`
        .button-56 {
          letter-spacing: 2px;
          text-decoration: none;
          text-transform: uppercase;
          color: #000;
          cursor: pointer;
          border: 3px solid;
          padding: 10px 20px;
          box-shadow:
            1px 1px 0px 0px,
            2px 2px 0px 0px,
            3px 3px 0px 0px,
            4px 4px 0px 0px,
            5px 5px 0px 0px;
          position: relative;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }

        .button-56:active {
          box-shadow: 0px 0px 0px 0px;
          top: 5px;
          left: 5px;
        }

        @media (min-width: 768px) {
          .button-56 {
            padding: 0.25em 0.75em;
          }
        }
      `}</style>
    </button>
  );
}

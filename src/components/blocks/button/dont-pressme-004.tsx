export default function DontPressMe004({
  label = 'Press Me'
}: {
  label?: string;
}) {
  return (
    <button className="button-55" type="button">
      <span className="text">{label}</span>

      <style jsx>{`
        .button-55 {
          appearance: button;
          background-color: #000;
          background-image: none;
          border: 1px solid #000;
          border-radius: 4px;
          box-shadow:
            #fff 4px 4px 0 0,
            #000 4px 4px 0 1px;
          box-sizing: border-box;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-weight: 400;
          line-height: 20px;
          margin: 0 5px 10px 0;
          overflow: visible;
          padding: 10px 20px;
          text-align: center;
          text-transform: none;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: middle;
          white-space: nowrap;
        }

        .button-55:focus {
          text-decoration: none;
        }

        .button-55:hover {
          text-decoration: none;
        }

        .button-55:active {
          box-shadow: rgba(0, 0, 0, 0.125) 0 3px 5px inset;
          outline: 0;
        }

        .button-55:not([disabled]):active {
          box-shadow:
            #fff 2px 2px 0 0,
            #000 2px 2px 0 1px;
          transform: translate(2px, 2px);
        }

        @media (min-width: 768px) {
          .button-55 {
            padding: 12px 50px;
          }
        }
      `}</style>
    </button>
  );
}

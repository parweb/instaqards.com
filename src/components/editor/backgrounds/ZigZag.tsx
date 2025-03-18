export function ZigZag() {
  return (
    <div>
      <style jsx>{`
        div {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(135deg, #eceddc 25%, transparent 25%) -50px 0,
            linear-gradient(225deg, #eceddc 25%, transparent 25%) -50px 0,
            linear-gradient(315deg, #eceddc 25%, transparent 25%),
            linear-gradient(45deg, #eceddc 25%, transparent 25%);
          background-size: 100px 100px;
          background-color: #ec173a;
        }
      `}</style>
    </div>
  );
}

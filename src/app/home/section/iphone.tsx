export const Iphone = ({
  url,
  scale = 100
}: {
  url: string;
  scale: number;
}) => {
  const ratio = 2283 / 1109;

  const width = 1109;
  const height = width * ratio;

  const factor = scale / 100;
  const translate = {
    10: -450,
    12.5: -350,
    20: -200,
    25: -150,
    30: -350 / 3,
    40: -75,
    50: -50,
    200: 25,
    300: 100 / 3
  }[scale];

  return (
    <div
      className="pointer-events-none"
      style={{ width: `${width * factor}px`, height: `${height * factor}px` }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: 'url(/iPhone-15-Pro2.png)',
          paddingTop: '44px',
          paddingRight: '46px',
          paddingBottom: '43px',
          paddingLeft: '50px',

          scale: factor,
          // margin: '-' + 100 - 100 * scale + '% 0',
          transform: `translate(${translate}%, ${translate}%)`
        }}
      >
        <iframe
          title={url}
          style={{
            transformOrigin: '0 0',
            transform: 'scale(2)',
            width: '50%',
            height: '50%',
            borderRadius: '70px'
          }}
          src={url}
        />
      </div>
    </div>
  );
};

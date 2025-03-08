import './dont-pressme-002.css';

export default function DontPressMe002({
  label = 'Press Me'
}: {
  label?: string;
}) {
  return (
    <button className="button-82-pushable" type="button">
      <span className="button-82-shadow" />
      <span className="button-82-edge" />
      <span className="button-82-front text">{label}</span>
    </button>
  );
}

import './dont-pressme-001.css';

export default function DontPressMe001({
  label = 'Press Me'
}: {
  label?: string;
}) {
  return (
    <button className="button" type="button">
      <span>{label}</span>
    </button>
  );
}

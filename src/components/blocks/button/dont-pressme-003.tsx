import './dont-pressme-003.css';

export default function DontPressMe003({
  label = 'Press Me'
}: {
  label?: string;
}) {
  return (
    <button className="button-10" type="button">
      <span className="text">{label}</span>
    </button>
  );
}

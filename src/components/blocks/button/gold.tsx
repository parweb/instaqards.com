import './gold.css';

export default function Gold({ label = 'Press me' }: { label?: string }) {
  return (
    <button className="button-18" type="button">
      <span className="text">{label}</span>
    </button>
  );
}

import './slide-from-left-001.css';

export default function SlideFromLeft001({
  label = 'Hello'
}: {
  label?: string;
}) {
  return (
    <button className="slide-from-left" type="button">
      {label}
    </button>
  );
}

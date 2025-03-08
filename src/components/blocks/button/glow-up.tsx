import './glow-up.css';

export default function GlowUp({ label = 'Glow up' }: { label?: string }) {
  return (
    <button className="glow-on-hover" type="button">
      {label}
    </button>
  );
}

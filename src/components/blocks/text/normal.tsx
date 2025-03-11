export default function NormalText({
  text = 'Normal text'
}: {
  text?: string;
}) {
  return <div className="text-center">{text}</div>;
}

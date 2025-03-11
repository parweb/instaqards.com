import * as z from 'zod';

export const input = z.object({
  text: z.string().optional().describe('Text')
});

export default function NormalText({
  text = 'Normal text'
}: z.infer<typeof input>) {
  return <div className="text-center">{text}</div>;
}

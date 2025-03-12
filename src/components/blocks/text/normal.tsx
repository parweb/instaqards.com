import * as z from 'zod';

export const input = z.object({
  text: z.string().min(1, 'Text is required').describe('Text')
});

export default function NormalText({
  text = 'Normal text'
}: Partial<z.infer<typeof input>>) {
  return <div className="text-center">{text}</div>;
}

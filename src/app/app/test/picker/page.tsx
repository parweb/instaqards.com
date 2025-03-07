import { getGoogleFonts } from 'actions/google-fonts';
import { ColorPickerComponent, FontPickerComponent } from './components';

export default async function TestPage() {
  const fonts = await getGoogleFonts();

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4">
        <FontPickerComponent fonts={fonts.map(font => font.family)} />
      </div>

      <ColorPickerComponent />

      <div>plop</div>
    </div>
  );
}

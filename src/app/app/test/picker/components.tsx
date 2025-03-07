'use client';

import { useState } from 'react';

import { FontPicker } from 'components/font-picker';
import { ColorPicker } from 'components/ui/color-picker';

export function FontPickerComponent({ fonts }: { fonts: string[] }) {
  const [currentFont, setCurrentFont] = useState<string | null>('Rock Salt');

  return (
    <div className="flex flex-col gap-4">
      <FontPicker
        name="font"
        fonts={fonts}
        onChange={setCurrentFont}
        value={currentFont}
      />

      <p style={{ fontFamily: currentFont ?? 'inherit' }}>
        Exemple de texte avec la police {currentFont}
      </p>
    </div>
  );
}

export function ColorPickerComponent() {
  const [color, setColor] = useState('#FF0000FF');

  return <ColorPicker name="color" value={color} onChange={setColor} />;
}

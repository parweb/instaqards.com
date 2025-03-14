'use client';

import useTranslation from 'hooks/use-translation';
import type { Lang } from 'translations';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

export const LanguageChooser = () => {
  const translate = useTranslation();

  const value = translate.lang;
  const onChange = (lang: Lang) => {
    translate.setLang(lang);
    window.location.reload();
  };

  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="it">Italiano</SelectItem>
        <SelectItem value="es">Español</SelectItem>
      </SelectContent>
    </Select>
  );
};

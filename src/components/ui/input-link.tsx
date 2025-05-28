'use client';

import { useId, useState } from 'react';
import { LuCheck, LuLink, LuMail, LuPhone } from 'react-icons/lu';

import { Input } from 'components/ui/input';
import { Block } from 'lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

const types = [
  { value: 'http', title: 'url', label: 'https://', icon: <LuLink /> },
  { value: 'tel', title: 'phone', label: 'tel:', icon: <LuPhone /> },
  { value: 'mail', title: 'email', label: 'mailto:', icon: <LuMail /> }
];

const getTypeFromValue = (
  value: string | number | readonly string[] | undefined
): string => {
  if (typeof value !== 'string') return 'http';

  if (value.startsWith('https://') || value.startsWith('http://')) {
    return 'http';
  }

  return types.find(t => value.startsWith(t.label))?.value ?? 'http';
};

export function InputLink(
  props: React.ComponentProps<typeof Input> & {
    shape?: Extract<Block, { kind: 'link' }>;
    isValid?: boolean;
  }
) {
  const id = useId();

  const initialValue = typeof props.value === 'string' ? props.value : '';
  const initialType = getTypeFromValue(initialValue);

  const [type, setType] = useState(initialType);

  const current = types.find(t => t.value === type);
  const prefix = current?.label ?? '';

  const fullValue = typeof props.value === 'string' ? props.value : '';

  let displayValue = fullValue;

  if (type === 'http') {
    if (fullValue.startsWith('https://')) {
      displayValue = fullValue.slice('https://'.length);
    } else if (fullValue.startsWith('http://')) {
      displayValue = fullValue.slice('http://'.length);
    }
  } else if (prefix && fullValue.startsWith(prefix)) {
    displayValue = fullValue.slice(prefix.length);
  }

  const handleValueChange = (newValue: string) => {
    setType(getTypeFromValue(newValue));
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    const newPrefix = types.find(t => t.value === newType)?.label ?? '';

    if (props.onChange) {
      props.onChange({
        target: { value: newPrefix + displayValue }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRawValue = e.target.value;

    let newFullValue = newRawValue;
    let detectedType = type;

    const httpTypeInfo = types.find(t => t.value === 'http');
    const currentPrefix = types.find(t => t.value === type)?.label ?? '';

    let typedPrefixInfo:
      | { value: string; label: string; typedLabel: string }
      | undefined;

    if (httpTypeInfo && newRawValue.startsWith('https://')) {
      typedPrefixInfo = { ...httpTypeInfo, typedLabel: 'https://' };
    } else if (httpTypeInfo && newRawValue.startsWith('http://')) {
      typedPrefixInfo = { ...httpTypeInfo, typedLabel: 'http://' };
    } else {
      const otherType = types.find(
        t => t.value !== 'http' && newRawValue.startsWith(t.label)
      );

      if (otherType) {
        typedPrefixInfo = { ...otherType, typedLabel: otherType.label };
      }
    }

    if (typedPrefixInfo) {
      newFullValue = newRawValue;
      detectedType = typedPrefixInfo.value;
      if (detectedType !== type) {
        setType(detectedType);
      }
    } else {
      newFullValue = currentPrefix + newRawValue;
    }

    if (props.onChange) {
      props.onChange({
        ...e,
        target: { ...e.target, value: newFullValue },
        currentTarget: { ...e.currentTarget, value: newFullValue }
      } as React.ChangeEvent<HTMLInputElement>);
    }

    handleValueChange(newFullValue);
  };

  console.log({ isValid: props.isValid });

  return (
    <div className="border-input flex w-full max-w-md items-center rounded-md border p-0 text-sm focus-within:ring-2 focus-within:ring-offset-2">
      <div className="mr-2">
        {props?.shape?.just === 'url' ? null : (
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className="m-[-1px] bg-stone-800 px-2 py-0 leading-none text-white [&_svg:not([class*='text-'])]:text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>

            <SelectContent>
              {types.map(t => (
                <SelectItem key={t.value} value={t.value} className="text-sm">
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {prefix && (
        <label
          htmlFor={id}
          className="text-muted-foreground/50 text-sm whitespace-nowrap"
        >
          {prefix}
        </label>
      )}

      <div className="flex-1">
        <Input
          {...props}
          id={id}
          type="text"
          className="h-8 flex-1 border-none px-1 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          value={displayValue}
          onChange={handleInputChange}
        />
      </div>

      {props.isValid ? (
        <div className="px-2">
          <LuCheck className="text-green-600" />
        </div>
      ) : (
        <>{current?.icon && <div className="px-2">{current?.icon}</div>}</>
      )}
    </div>
  );
}

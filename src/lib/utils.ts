import { clsx, type ClassValue } from 'clsx';
import { Item } from 'components/maps/services/google-maps';
import { twMerge } from 'tailwind-merge';
import countries from 'world-countries';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function fetcher<JSON>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: 'no-store' });

  return response.json();
}

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, num: number) => {
  if (!str) return '';
  if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num)}...`;
};

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
  }
  try {
    const response = await fetch(
      `https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return `data:image/png;base64,${base64}`;
  } catch {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
  }
};

export const placeholderBlurhash =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==';

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const focusInput = [
  // base
  'focus:ring-2',
  // ring color
  'focus:ring-blue-200 dark:focus:ring-blue-700/30',
  // border color
  'focus:border-blue-500 dark:focus:border-blue-700'
];

export const hasErrorInput = [
  // base
  'ring-2',
  // border color
  'border-red-500 dark:border-red-700',
  // ring color
  'ring-red-200 dark:ring-red-700/30'
];

export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-blue-500 dark:outline-blue-500'
];

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export type StyleProperties = {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
};

export type BlockStyle = Partial<Record<'normal' | 'hover', StyleProperties>>;

export const generateCssProperties = (styleObj?: StyleProperties) => {
  if (!styleObj) return '';

  return [
    styleObj.fontFamily && `font-family: ${styleObj.fontFamily};`,
    styleObj.fontSize && `font-size: ${styleObj.fontSize}px;`,
    styleObj.color && `color: ${styleObj.color};`,
    styleObj.backgroundColor && `background-color: ${styleObj.backgroundColor};`
  ]
    .filter(Boolean)
    .join('\n');
};

export const getSubdomain = (name: string, apexName: string) => {
  if (name === apexName) return null;
  return name.slice(0, name.length - apexName.length - 1);
};

export const getAlphaTwoCode = (code: string) => {
  const uc = String(code).toUpperCase();
  const country = countries.find(
    c => c.cca2 === uc || c.ccn3 === uc || c.cca3 === uc
  );
  return String(country?.cca2 || code).toLowerCase();
};

type Share = {
  label: string;
};

export type Block = Share &
  (
    | {
        kind: 'upload';
        multiple: boolean;
        preview: boolean;
        accept: Record<string, string[]>;
      }
    | { kind: 'string' }
    | { kind: 'link'; just?: 'url' }
    | { kind: 'socials' }
    | { kind: 'hidden' }
    | { kind: 'color'; default: string }
    | { kind: 'number'; defaultValue: number }
    | {
        kind: 'range';
        min: number;
        max: number;
        step: number;
        defaultValue: number;
      }
    | {
        kind: 'address';
        placeholder: string;
        defaultValue: {
          components: Item['components'];
          formatted_address: Item['formatted_address'];
        };
      }
    | {
        kind: 'font';
        default: Partial<{
          color: string;
          fontSize: `${string}px`;
          fontFamily: string;
          textAlign: 'left' | 'center' | 'right' | 'justify';
        }>;
      }
    | {
        kind: 'container';
        default: Partial<{
          backgroundColor: string;
          borderColor: string;
          borderWidth: `${string}px`;
          borderRadius: `${string}px`;
          padding: `${string}px`;
          margin: `${string}px`;
        }>;
      }
  );

export const json = (data: Block) => JSON.stringify(data, null, 2);
export const text = (data: string) => JSON.parse(data) as Block;

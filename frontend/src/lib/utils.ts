import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const isNegative = bytes < 0;
  const absBytes = Math.abs(bytes);

  const i = Math.floor(Math.log(absBytes) / Math.log(k));
  // Clamp i to array bounds to prevent undefined
  const sizeIndex = Math.min(i, sizes.length - 1);

  const value = parseFloat((absBytes / Math.pow(k, sizeIndex)).toFixed(2));
  return `${(isNegative ? '-' : '') + value} ${sizes[sizeIndex]}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

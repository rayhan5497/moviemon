// src/utils/cn.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function mergeClass(...inputs) {
  return twMerge(clsx(inputs));
}

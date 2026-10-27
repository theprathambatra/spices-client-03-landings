// Source: shadcn/ui convention (`cn` in lib/utils) — every Magic UI / Aceternity / Motion Primitives / Cult UI / SmoothUI registry item imports this | License: MIT
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional class lists and resolve Tailwind conflicts (last one wins: cn('p-2', 'p-4') -> 'p-4'). */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

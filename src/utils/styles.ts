import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { ALL_THEME_CLASS_NAMES } from "@/utils/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

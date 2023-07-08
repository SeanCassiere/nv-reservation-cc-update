import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { ALL_COLOR_SCHEME_CLASSNAMES } from "@/utils/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

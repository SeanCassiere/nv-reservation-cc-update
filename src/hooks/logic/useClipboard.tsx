import { useEffect, useState } from "react";

type InternalCopyFn = (text: string) => Promise<boolean>; // Return success
type CopyFn = (text: string) => void;

interface UseClipboardOptions {
  /**
   * Reset the status after a certain number of milliseconds. This is useful
   * for showing a temporary success message.
   */
  successDuration?: number;
}

export function useClipboard(options?: UseClipboardOptions): [boolean, CopyFn] {
  const [isCopied, setIsCopied] = useState(false);
  const successDuration = options && options.successDuration;

  const internalCopy: InternalCopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setIsCopied(false);
      return false;
    }
  };

  const copy: CopyFn = async (item: string) => {
    const didCopy = await internalCopy(item);
    setIsCopied(didCopy);
  };

  useEffect(() => {
    if (isCopied && successDuration) {
      const id = setTimeout(() => {
        setIsCopied(false);
      }, successDuration);

      return () => {
        clearTimeout(id);
      };
    }
  }, [isCopied, successDuration]);

  return [isCopied, copy];
}

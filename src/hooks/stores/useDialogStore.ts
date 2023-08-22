import { create } from "zustand";
import { devtools } from "zustand/middleware";

type DialogStoreType = {
  isBackConfirmationDialogOpen: boolean;

  setBackConfirmationDialogState: (payload?: boolean) => void;
};

export const useDialogStore = create(
  devtools<DialogStoreType>(
    (set, get) => ({
      isBackConfirmationDialogOpen: false,
      setBackConfirmationDialogState: (option) => {
        let targetState = !get().isBackConfirmationDialogOpen;

        if (typeof option === "boolean") {
          targetState = option;
        }

        set({ isBackConfirmationDialogOpen: targetState }, false, `setBackConfirmationDialogState/${targetState}`);
      },
    }),
    { enabled: true, name: "zustand/dialogStore" },
  ),
);

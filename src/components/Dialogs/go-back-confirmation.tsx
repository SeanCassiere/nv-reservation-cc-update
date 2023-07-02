import React, { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";

import { ExclamationTriangleIcon } from "@/components/icons";
import { Button as UIButton } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmBtnText: string;
  cancelBtnText: string;
}

export const GoBackConfirmationDialog: React.FC<Props> = React.memo((props) => {
  return (
    <Transition.Root show={props.isOpen} as={Fragment}>
      <Dialog as="div" onClose={props.onCancel} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-background/75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block transform overflow-hidden rounded border border-accent bg-background px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning-foreground text-warning">
                  <ExclamationTriangleIcon />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-primary">
                    {props.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-primary/80">{props.message}</p>
                  </div>
                  <div className="mt-10 flex flex-col gap-2">
                    <UIButton type="button" onClick={props.onConfirm} size="sm" autoFocus>
                      {props.confirmBtnText}
                    </UIButton>
                    <UIButton type="button" onClick={props.onCancel} size="sm" variant="ghost">
                      {props.cancelBtnText}
                    </UIButton>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
});

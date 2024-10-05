"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import XMarkIcon from "@heroicons/react/24/outline/esm/XMarkIcon";
import { createContext, ReactNode, useState } from "react";
import { Subject } from "rxjs";
import { Button } from "./Button";
import { useObservable, useSubject } from "./rx";
import { useModal } from "./useModal";

type ModalContextType = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const subject = useSubject<ReactNode>();

  function showModal(modal: ReactNode) {
    subject.next(modal);
  }

  function hideModal() {
    subject.next(null);
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <ModalRenderer subject={subject} />
    </ModalContext.Provider>
  );
}

function ModalRenderer({ subject }: { subject: Subject<ReactNode> }) {
  const [modal, setModal] = useState<ReactNode>(null);

  useObservable(
    subject,
    (modalToOpen) => {
      setModal(modalToOpen);
    },
    [],
  );

  return (
    <Dialog
      open={!!modal}
      onClose={() => setModal(null)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            {modal}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export function ModalHeader({ title }: { title: string }) {
  const { hideModal } = useModal();

  return (
    <div className="relative flex items-start pr-6">
      <div className="absolute right-0 sm:block">
        <button
          type="button"
          onClick={hideModal}
          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="sr-only">Close</span>
          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>
      <div className="text-left">
        <DialogTitle
          as="h3"
          className="text-base font-semibold leading-6 text-gray-900"
        >
          {title}
        </DialogTitle>
      </div>
    </div>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <section className="mt-5 text-sm text-gray-500">{children}</section>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="mt-5 flex flex-row-reverse gap-1">{children}</div>;
}

export function SubmitModalAction({ text }: { text: string }) {
  return <Button style="primary" text={text} submit />;
}

export function PrimaryModalAction({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return <Button style="primary" text={text} onClick={onClick} />;
}

export function CloseModalAction({ text = "Cancel" }: { text?: string }) {
  const { hideModal } = useModal();
  return <Button style="default" text={text} onClick={hideModal} />;
}

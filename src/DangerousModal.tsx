import { DialogTitle } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "./Button";
import { useModal } from "./useModal";

export function DangerousModal({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void>;
  onCancel?: () => Promise<void>;
}) {
  const { hideModal } = useModal();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
        <button
          type="button"
          onClick={hideModal}
          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="sr-only">Close</span>
          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>
      <div className="flex items-start">
        <div className="mx-0 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="h-6 w-6 text-red-600"
          />
        </div>
        <div className="ml-4 mt-0 text-left">
          <DialogTitle
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            {title}
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-row-reverse gap-1">
        <Button
          style="dangerous"
          text={confirmText ?? "Confirm"}
          disabled={loading}
          onClick={() => {
            setLoading(true);
            onConfirm()
              .then(() => {
                hideModal();
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        />
        <Button
          text={cancelText ?? "Cancel"}
          onClick={hideModal}
          disabled={loading}
        />
      </div>
    </>
  );
}

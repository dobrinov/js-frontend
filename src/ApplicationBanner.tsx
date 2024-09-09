import { XMarkIcon } from "@heroicons/react/24/solid";

export function ApplicationBanner({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-x-6 bg-red-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p className="text-sm leading-6 text-white">
        <strong>{text}</strong>
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          onClick={onClick}
        >
          <XMarkIcon aria-hidden="true" className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}

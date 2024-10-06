import { XCircleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";

export function Alert({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "border-l-4 border-red-400 bg-red-50 p-4",
        className,
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{text}</p>
        </div>
      </div>
    </div>
  );
}

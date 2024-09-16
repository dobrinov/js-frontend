import { Button as HeadlessButton } from "@headlessui/react";
import classNames from "classnames";
import { useTooltip } from "./useTooltip";

const BASE = [
  "inline-flex",
  "items-center",
  "gap-x-1",
  "font-semibold",
  "px-3.5",
  "py-2.5",
  "rounded-md",
  "select-none",
  "shadow-sm",
  "text-sm",
  "focus-visible:outline-4",
  "focus-visible:outline",
];

const ACTIVE = ["active:translate-y-0.5"];
const DISABLED = ["disabled:cursor-not-allowed", "disabled:opacity-50"];

const STYLES = {
  default: {
    base: [...BASE, "bg-gray-100", "text-gray-900"],
    enabled: [...ACTIVE, "hover:bg-gray-200", "focus-visible:outline-gray-200"],
    disabled: [...DISABLED],
  },
  primary: {
    base: [...BASE, "bg-indigo-600", "text-white"],
    enabled: [
      ...ACTIVE,
      "hover:bg-indigo-500",
      "focus-visible:outline-indigo-200",
    ],
    disabled: [...DISABLED],
  },
  dangerous: {
    base: [...BASE, "text-red-600", "ring-2", "ring-inset", "ring-red-600"],
    enabled: [
      ...ACTIVE,
      "hover:bg-red-600",
      "hover:text-white",
      "focus-visible:outline-red-100",
    ],
    disabled: [...DISABLED],
  },
};

export function Button({
  text,
  style = "default",
  loading = false,
  disabled = false,
  onClick,
}: {
  text: string;
  style?: "primary" | "default" | "dangerous";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean | string;
}) {
  const { setReference, getReferenceProps, renderTooltip } = useTooltip({
    content: typeof disabled === "string" ? disabled : null,
  });

  const showTooltip = !!disabled;

  return (
    <>
      <HeadlessButton
        ref={setReference}
        {...getReferenceProps()}
        className={[
          ...STYLES[style].base,
          ...(disabled || loading
            ? STYLES[style].disabled
            : STYLES[style].enabled),
        ].join(" ")}
        onClick={() => {
          if (disabled || loading) return;
          onClick && onClick();
        }}
        disabled={!!disabled || loading}
      >
        {loading && <Spinner />}
        {text}
      </HeadlessButton>
      {showTooltip && renderTooltip}
    </>
  );
}

export function SubmitButton({
  text,
  loading = false,
  disabled = false,
}: {
  text: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      className={classNames(
        BASE,
        ...[disabled || loading ? DISABLED : ACTIVE],
        STYLES.primary,
      )}
      disabled={disabled}
    >
      {loading && <Spinner />}
      {text}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="-ml-1 h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

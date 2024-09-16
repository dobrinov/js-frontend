import { Button as HeadlessButton } from "@headlessui/react";
import classNames from "classnames";
import { useTooltip } from "./useTooltip";

const BASE = [
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
  disabled = false,
  onClick,
}: {
  text: string;
  style?: "primary" | "default" | "dangerous";
  onClick?: () => void;
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
          ...(disabled ? STYLES[style].disabled : STYLES[style].enabled),
        ].join(" ")}
        onClick={() => {
          if (disabled) return;
          onClick && onClick();
        }}
        disabled={!!disabled}
      >
        {text}
      </HeadlessButton>
      {showTooltip && renderTooltip}
    </>
  );
}

export function SubmitButton({
  text,
  disabled = false,
}: {
  text: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      className={classNames(BASE, ACTIVE, STYLES.primary)}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

import { Button as HeadlessButton } from "@headlessui/react";
import classNames from "classnames";

const BASE = [
  "font-semibold",
  "px-3.5",
  "py-2.5",
  "rounded-md",
  "select-none",
  "shadow-sm",
  "text-sm",
];

const ACTIVE = ["active:translate-y-0.5"];

const DISABLED = ["disabled:cursor-not-allowed", "disabled:opacity-50"];

const STYLES = {
  default: {
    base: [...BASE, "bg-gray-100", "text-gray-900"],
    enabled: [...ACTIVE, "hover:bg-gray-200"],
    disabled: [...DISABLED],
  },
  primary: {
    base: [...BASE, "bg-indigo-600", "text-white"],
    enabled: [
      ...ACTIVE,
      "focus-visible:outline-2",
      "focus-visible:outline-indigo-600",
      "focus-visible:outline-offset-2",
      "focus-visible:outline",
      "hover:bg-indigo-500",
    ],
    disabled: [...DISABLED],
  },
  dangerous: {
    base: [...BASE, "text-red-600", "ring-2", "ring-inset", "ring-red-600"],
    enabled: [...ACTIVE],
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
  disabled?: boolean;
}) {
  return (
    <HeadlessButton
      className={[
        ...STYLES[style].base,
        ...(disabled ? STYLES[style].disabled : STYLES[style].enabled),
      ].join(" ")}
      onClick={() => {
        if (disabled) return;
        onClick && onClick();
      }}
      disabled={disabled}
    >
      {text}
    </HeadlessButton>
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

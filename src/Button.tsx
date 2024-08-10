import { Button as HeadlessButton } from "@headlessui/react";

const STYLES = {
  default:
    "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
  primary:
    "rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
};

export function Button({
  text,
  style = "default",
  onClick,
}: {
  text: string;
  style?: "primary" | "default";
  onClick: () => void;
}) {
  return (
    <HeadlessButton className={STYLES[style]} onClick={onClick}>
      {text}
    </HeadlessButton>
  );
}

export function SubmitButton({ text }: { text: string }) {
  return (
    <button type="submit" className={STYLES.primary}>
      {text}
    </button>
  );
}

import { Button as HeadlessButton } from "@headlessui/react";
import { useTooltip } from "./useTooltip";

const BASE = [
  "relative",
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

type CommonProps = {
  text: string;
  style?: "primary" | "default" | "dangerous";
  loading?: boolean;
  disabled?: boolean | string;
};

type OnClickProps = CommonProps & { onClick?: () => void };
type SubmitProps = CommonProps & { submit: true };

export function Button(props: OnClickProps): JSX.Element;
export function Button(props: SubmitProps): JSX.Element;
export function Button(props: SubmitProps | OnClickProps): JSX.Element {
  const { text, disabled, style = "default", loading = false } = props;

  const { setReference, getReferenceProps, renderTooltip } = useTooltip({
    content: typeof disabled === "string" ? disabled : null,
  });

  const showTooltip = !!disabled;

  return (
    <>
      <HeadlessButton
        ref={setReference}
        {...getReferenceProps()}
        type={"submit" in props ? "submit" : "button"}
        className={[
          ...STYLES[style].base,
          ...(disabled || loading
            ? STYLES[style].disabled
            : STYLES[style].enabled),
        ].join(" ")}
        onClick={() => {
          if (disabled || loading) return;
          "onClick" in props && props.onClick && props.onClick();
        }}
        disabled={!!disabled || loading}
      >
        {loading ? (
          <>
            <Spinner />
            <span className="text-transparent">{text}</span>
          </>
        ) : (
          text
        )}
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
    <Button
      style="primary"
      text={text}
      loading={loading}
      disabled={disabled}
      submit
    />
  );
}

function Spinner() {
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-md">
      <svg
        className="h-5 w-5 animate-spin overflow-hidden"
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
    </div>
  );
}

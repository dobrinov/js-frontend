import { ReactElement, ReactNode, useRef, useState } from "react";

import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from "@floating-ui/react";

export function useTooltip({ content }: { content: ReactNode }): {
  setReference: (element: HTMLElement | null) => void;
  getReferenceProps: () => Record<string, unknown>;
  renderTooltip: ReactElement | null;
} {
  const [visible, setVisible] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: visible,
    placement: "top",
    onOpenChange: setVisible,
    middleware: [
      offset({ mainAxis: 8, crossAxis: 0 }),
      flip(),
      shift(),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
  ]);

  return {
    setReference: refs.setReference,
    getReferenceProps,
    renderTooltip:
      content && visible ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, display: "block" }}
            className="whitespace-normal break-words rounded-lg bg-black px-3 py-1 font-sans text-sm font-normal text-white focus:outline-none"
            {...getFloatingProps()}
          >
            {content}
            <FloatingArrow ref={arrowRef} context={context} fill="#15191e" />
          </div>
        </FloatingPortal>
      ) : null,
  };
}

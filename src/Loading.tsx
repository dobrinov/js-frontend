import { useRef, useState } from "react";

export function Loading() {
  const [render, setRender] = useState(false);
  const timer = useRef<number | null>(null);

  if (!render) {
    timer.current = window.setTimeout(() => {
      setRender(true);
    }, 200);
  }

  if (!render) return null;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 150"
        width="80"
        height="40"
      >
        <path
          fill="none"
          stroke="#000000"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="300 385"
          strokeDashoffset="0"
          d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
        >
          <animate
            attributeName="stroke-dashoffset"
            calcMode="spline"
            dur="2"
            values="685;-685"
            keySplines="0 0 1 1"
            repeatCount="indefinite"
          ></animate>
        </path>
      </svg>
    </div>
  );
}

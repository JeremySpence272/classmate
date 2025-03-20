import React, { useRef, useEffect } from "react";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

interface BubbleMenuButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  tooltip: string;
  darkMode?: boolean;
  className?: string;
  children: React.ReactNode;
}

const BubbleMenuButton = React.forwardRef<
  HTMLButtonElement,
  BubbleMenuButtonProps
>(
  (
    {
      onClick,
      disabled = false,
      isActive = false,
      tooltip,
      darkMode = true,
      className = "",
      children,
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (buttonRef.current) {
        tippy(buttonRef.current, {
          content: tooltip,
          placement: "top",
          arrow: true,
          theme: "dark",
          offset: [0, 8],
          zIndex: 99999,
          animation: "fade",
          duration: 200,
          allowHTML: false,
          onCreate: ({ popper }) => {
            const tooltip = popper.querySelector(".tippy-box") as HTMLElement;
            if (tooltip) {
              tooltip.style.cssText = `
                background-color: rgba(24, 24, 27, 0.5) !important;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
              `;
            }
          },
        });
      }
    }, [tooltip]);

    const baseClass = `p-1.5 rounded text-sm font-medium transition-colors duration-150 ease-in-out flex items-center justify-center w-9 h-9 ${className}`;

    const buttonClass = `${baseClass} ${
      darkMode
        ? "hover:bg-zinc-700 text-zinc-200 border border-transparent hover:border-zinc-600"
        : "hover:bg-gray-100 text-zinc-800 border border-transparent hover:border-gray-300"
    }`;

    const activeButtonClass = `${baseClass} ${
      darkMode
        ? "bg-zinc-700 text-white border border-zinc-600"
        : "bg-gray-100 text-black border border-gray-400"
    }`;

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onClick={onClick}
        disabled={disabled}
        className={isActive ? activeButtonClass : buttonClass}
      >
        {children}
      </button>
    );
  }
);

BubbleMenuButton.displayName = "BubbleMenuButton";

export default BubbleMenuButton;

import * as React from "react";
import { Button, ButtonProps } from "@ui/components/button";
import { cn } from "@ui/lib/utils";

type OddNumber = 1 | 3 | 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19 | 21 | 23 | 25;

interface CrosshairButtonProps extends ButtonProps {
  crosshairSize?: OddNumber;
  crosshairColor?: string;
}

const CrosshairButton = React.forwardRef<
  HTMLButtonElement,
  CrosshairButtonProps
>(
  (
    {
      className,
      crosshairSize = 9,
      crosshairColor = "currentColor",
      children,
      ...props
    },
    ref
  ) => {
    const offset = 0.5;
    return (
      <div className="relative inline-block">
        {/* Button */}
        <Button ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </Button>

        {/* Top-left corner crosshair */}
        <div className="absolute pointer-events-none top-0 left-0 z-10">
          {/* Vertical line extending down */}
          <div
            className="absolute"
            style={{
              left: 0,
              top: `-${crosshairSize / 2 - offset}px`,
              width: "1px",
              height: `${crosshairSize}px`,
              backgroundColor: crosshairColor,
            }}
          />
          {/* Horizontal line extending right */}
          <div
            className="absolute"
            style={{
              left: `-${crosshairSize / 2 - offset}px`,
              top: 0,
              width: `${crosshairSize}px`,
              height: "1px",
              backgroundColor: crosshairColor,
            }}
          />
        </div>

        {/* Top-right corner crosshair */}
        <div className="absolute pointer-events-none top-0 right-0 z-10">
          {/* Vertical line extending down */}
          <div
            className="absolute"
            style={{
              right: 0,
              top: `-${crosshairSize / 2 - offset}px`,
              width: "1px",
              height: `${crosshairSize}px`,
              backgroundColor: crosshairColor,
            }}
          />
          {/* Horizontal line extending left */}
          <div
            className="absolute"
            style={{
              right: `-${crosshairSize / 2 - offset}px`,
              top: 0,
              width: `${crosshairSize}px`,
              height: "1px",
              backgroundColor: crosshairColor,
            }}
          />
        </div>

        {/* Bottom-left corner crosshair */}
        <div className="absolute pointer-events-none bottom-0 left-0 z-10">
          {/* Vertical line extending up */}
          <div
            className="absolute"
            style={{
              left: 0,
              bottom: `-${crosshairSize / 2 - offset}px`,
              width: "1px",
              height: `${crosshairSize}px`,
              backgroundColor: crosshairColor,
            }}
          />
          {/* Horizontal line extending right */}
          <div
            className="absolute"
            style={{
              left: `-${crosshairSize / 2 - offset}px`,
              bottom: 0,
              width: `${crosshairSize}px`,
              height: "1px",
              backgroundColor: crosshairColor,
            }}
          />
        </div>

        {/* Bottom-right corner crosshair */}
        <div className="absolute pointer-events-none bottom-0 right-0 z-10">
          {/* Vertical line extending up */}
          <div
            className="absolute"
            style={{
              right: 0,
              bottom: `-${crosshairSize / 2 - offset}px`,
              width: "1px",
              height: `${crosshairSize}px`,
              backgroundColor: crosshairColor,
            }}
          />
          {/* Horizontal line extending left */}
          <div
            className="absolute"
            style={{
              right: `-${crosshairSize / 2 - offset}px`,
              bottom: 0,
              width: `${crosshairSize}px`,
              height: "1px",
              backgroundColor: crosshairColor,
            }}
          />
        </div>
      </div>
    );
  }
);

CrosshairButton.displayName = "CrosshairButton";

export { CrosshairButton, type CrosshairButtonProps };

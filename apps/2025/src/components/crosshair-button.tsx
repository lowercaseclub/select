import * as React from "react";
import { Button, ButtonProps } from "@ui/components/button";
import { cn } from "@ui/lib/utils";

interface CrosshairButtonProps extends ButtonProps {
  crosshairSize?: number;
  crosshairColor?: string;
}

const CrosshairButton = React.forwardRef<
  HTMLButtonElement,
  CrosshairButtonProps
>(
  (
    {
      className,
      crosshairSize = 7,
      crosshairColor = "currentColor",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative inline-block">
        {/* Button */}
        <Button ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </Button>

        {/* Top-left corner crosshair */}
        <div className="absolute pointer-events-none top-0 left-0 z-10">
          {/* Vertical line extending up */}
          <div
            className="absolute"
            style={{
              left: 0,
              bottom: 0,
              width: "1px",
              height: crosshairSize,
              backgroundColor: crosshairColor,
            }}
          />
          {/* Horizontal line extending left */}
          <div
            className="absolute"
            style={{
              right: 0,
              top: 0,
              width: crosshairSize,
              height: "1px",
              backgroundColor: crosshairColor,
            }}
          />
        </div>

        {/* Top-right corner crosshair */}
        <div className="absolute pointer-events-none top-0 right-0 z-10">
          {/* Vertical line extending up */}
          <div
            className="absolute"
            style={{
              right: 0,
              bottom: 0,
              width: "1px",
              height: crosshairSize,
              backgroundColor: crosshairColor,
            }}
          />
          {/* Horizontal line extending right */}
          <div
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: crosshairSize,
              height: "1px",
              backgroundColor: crosshairColor,
            }}
          />
        </div>

        {/* Bottom-left corner crosshair */}
        <div className="absolute pointer-events-none bottom-0 left-0 z-10">
          {/* Vertical line extending down */}
          <div
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: "1px",
              height: crosshairSize,
              backgroundColor: crosshairColor,
            }}
          />
          {/* Horizontal line extending left */}
          <div
            className="absolute"
            style={{
              right: 0,
              bottom: 0,
              width: crosshairSize,
              height: "1px",
              backgroundColor: crosshairColor,
            }}
          />
        </div>

        {/* Bottom-right corner crosshair */}
        <div className="absolute pointer-events-none bottom-0 right-0 z-10">
          {/* Vertical line extending down */}
          <div
            className="absolute"
            style={{
              right: 0,
              top: 0,
              width: "1px",
              height: crosshairSize,
              backgroundColor: crosshairColor,
            }}
          />
          {/* Horizontal line extending right */}
          <div
            className="absolute"
            style={{
              left: 0,
              bottom: 0,
              width: crosshairSize,
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

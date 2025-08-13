interface ColumnLineProps {
  position?: "left" | "right";
  offset?: string;
  className?: string;
}

export function ColumnLine({
  position = "left",
  offset = "8",
  className = "",
}: ColumnLineProps) {
  const positionClass =
    position === "left" ? `left-${offset}` : `right-${offset}`;

  return (
    <div
      className={`h-full w-px border-l border-column-lines border-dashed absolute top-0 ${positionClass} ${className}`}
    />
  );
}

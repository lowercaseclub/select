interface ColumnLineProps {
  position?: "left" | "right";
  offset?: string;
  className?: string;
}

export function ColumnLine({ className = "" }: ColumnLineProps) {
  return (
    <div
      className={`h-full w-32 border-l border-column-lines border-dashed absolute left-8 top-0 ${className}`}
    />
  );
}

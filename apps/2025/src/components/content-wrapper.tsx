import { ReactNode } from "react";
import { ColumnLine } from "./column-line";
import { TopLines } from "./top-lines";

interface ContentWrapperProps {
  children: ReactNode;
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  return (
    <div className="lg:mx-8">
      <div className="relative overflow-hidden border-l border-r border-column-lines max-w-site mx-auto">
        <ColumnLine />
        {children}
      </div>
    </div>
  );
}

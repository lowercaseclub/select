import { TabsTrigger } from "@ui/components/tabs";
import { ComponentProps } from "react";

interface ScheduleTabTriggerProps extends ComponentProps<typeof TabsTrigger> {
  stageName: string;
}

export function ScheduleTabTrigger({
  stageName,
  className = "",
  ...props
}: ScheduleTabTriggerProps) {
  return (
    <TabsTrigger
      className={`bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-3 ${className} text-3xl`}
      {...props}
    >
      {stageName}
    </TabsTrigger>
  );
}

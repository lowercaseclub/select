"use client";

import { Tabs } from "@ui/components/tabs";
import { useStage } from "../contexts/stage-context";

interface ScheduleTabsClientProps {
  children: React.ReactNode;
}

export function ScheduleTabsClient({ children }: ScheduleTabsClientProps) {
  const { activeStage, setActiveStage } = useStage();

  const handleStageChange = (stage: string) => {
    setActiveStage(stage as "main" | "build");
  };

  return (
    <Tabs value={activeStage} onValueChange={handleStageChange} className="w-full">
      {children}
    </Tabs>
  );
}

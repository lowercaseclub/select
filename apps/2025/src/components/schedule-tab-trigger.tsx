import { TabsTrigger } from "@ui/components/tabs";
import { LocationHoverCard } from "./location-hover-card";

interface ScheduleTabTriggerProps {
  value: string;
  stageName: string;
  locationName: string;
  locationDisplayName: string;
  address: string;
  mapUrl: string;
  className?: string;
}

export function ScheduleTabTrigger({
  value,
  stageName,
  locationName,
  locationDisplayName,
  address,
  mapUrl,
  className = "",
}: ScheduleTabTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className={`bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-3 ${className}`}
    >
      <span className="text-lg font-medium">{stageName}</span>
      <span className="text-muted-foreground data-[state=active]:text-foreground ml-2 hidden md:inline">
        @{" "}
        <LocationHoverCard
          locationName={locationName}
          address={address}
          mapUrl={mapUrl}
        >
          {locationDisplayName}
        </LocationHoverCard>
      </span>
    </TabsTrigger>
  );
}

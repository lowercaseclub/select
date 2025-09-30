import { LocationHoverCard } from "./location-hover-card";

interface ScheduleLocationProps {
  locationName: string;
  locationDisplayName: string;
  address: string;
  mapUrl: string;
}

export function ScheduleLocation({
  locationName,
  locationDisplayName,
  address,
  mapUrl,
}: ScheduleLocationProps) {
  return (
    <div className="py-8 border-b border-column-lines">
      <div className="max-w-site mx-auto px-8">
        <div className="text-lg text-foreground">
          <span className="text-muted-foreground">Location:</span>{" "}
          <LocationHoverCard
            locationName={locationName}
            address={address}
            mapUrl={mapUrl}
          >
            {locationDisplayName}
          </LocationHoverCard>
        </div>
      </div>
    </div>
  );
}

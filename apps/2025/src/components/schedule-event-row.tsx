interface ScheduleEventRowProps {
  event: {
    title: string;
    time: string;
    description?: string;
    speakers?: string;
  };
  index: number;
}

export function ScheduleEventRow({ event, index }: ScheduleEventRowProps) {
  const isSpecialEvent =
    event.title.includes("[LUNCH]") || event.title.includes("[PARTY]");
  const displayTitle = event.title
    .replace("[LUNCH]", "")
    .replace("[PARTY]", "")
    .trim();

  return (
    <>
      {/* Mobile layout - stacked cards */}
      <div
        className={`md:hidden py-4 border-b border-column-lines hover:bg-muted/20 transition-colors ${
          isSpecialEvent
            ? "bg-muted/30 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px,transparent_11px)]"
            : ""
        }`}
      >
        <div className="max-w-site mx-auto px-8">
          <div className="space-y-2">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {event.time}
            </div>
            <h3 className="font-medium text-base leading-tight">
              {displayTitle}
            </h3>
            {event.speakers && (
              <div className="text-sm text-muted-foreground">
                {event.speakers}
              </div>
            )}
            {event.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop layout - exactly as it was before */}
      <div
        key={`${event.title}-${event.time}-${index}`}
        className={`hidden md:block py-6 border-b border-column-lines hover:bg-muted/20 transition-colors ${
          isSpecialEvent
            ? "bg-muted/30 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px,transparent_11px)]"
            : ""
        }`}
      >
        <div className="max-w-site mx-auto px-8 grid grid-cols-12 gap-4">
          <div className="col-span-3 text-sm font-mono">{event.time}</div>
          <div className="col-span-5">
            <h3 className="font-medium text-lg">{displayTitle}</h3>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {event.description}
              </p>
            )}
          </div>
          <div className="col-span-4 text-muted-foreground">
            {event.speakers}
          </div>
        </div>
      </div>
    </>
  );
}

export function AnnouncingSoonTile() {
  return (
    <>
      <div className="aspect-square bg-muted border border-column-lines relative flex items-center justify-center overflow-hidden">
        {/* 1px X pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="100"
            y1="0"
            x2="0"
            y2="100"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Overlay text */}
        <div className="relative z-10 text-center">
          <div className="bg-black/50 px-3 py-1 rounded text-white text-xs font-medium tracking-wider">
            ANNOUNCEMENT SOON
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-medium text-muted-foreground">
          Speaker TBA
        </h3>
        <p className="text-sm text-muted-foreground">
          More speakers to be announced soon
        </p>
      </div>
    </>
  );
}

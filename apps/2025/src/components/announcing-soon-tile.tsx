export function AnnouncingSoonTile() {
  return (
    <>
      <div className="aspect-square bg-muted/30 relative flex items-center justify-center overflow-hidden">
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
          <div className="bg-black/30 px-3 py-1 rounded text-white text-xs font-medium tracking-wider">
            ANNOUNCEMENT SOON
          </div>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">{/* Empty space to match speaker card layout */}</div>
    </>
  )
}

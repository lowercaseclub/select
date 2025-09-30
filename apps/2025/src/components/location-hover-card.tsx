'use client'

// import { Button } from "@ui/components/button"; // Currently unused
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui/components/hover-card'

interface LocationHoverCardProps {
  children: React.ReactNode
  locationName: string
  address: string
  mapUrl: string
  images?: string[]
}

export function LocationHoverCard({
  children,
  locationName,
  address,
  mapUrl,
  images = [], // eslint-disable-line @typescript-eslint/no-unused-vars
}: LocationHoverCardProps) {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer hover:underline">{children}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" side="right" align="start">
        {/* Map section - no padding, bleeds to edges */}
        <div className="h-50 overflow-hidden">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: 'grayscale(100%) invert(1) brightness(1.2) contrast(1.2)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${locationName}`}
          />
        </div>

        {/* Address and directions */}
        <div className="p-4 text-left">
          <h4 className="font-semibold mb-2 text-base">{locationName}</h4>
          <p className="text-sm text-light-foreground mb-3">{address}</p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent-1-foreground hover:underline text-sm"
          >
            Get Directions →
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

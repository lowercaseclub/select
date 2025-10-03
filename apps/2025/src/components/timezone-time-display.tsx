'use client'

import { useEffect, useState } from 'react'
import { convertSFTimeToLocal, getTimezoneAbbreviation } from '../lib/timezone-utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui/components/hover-card'

interface TimezoneTimeDisplayProps {
  sfTime: string
  className?: string
  showTimezone?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export function TimezoneTimeDisplay({
  sfTime,
  className = '',
  showTimezone = true,
  variant = 'default',
}: TimezoneTimeDisplayProps) {
  const [timeDisplay, setTimeDisplay] = useState<{
    sfTime: string
    localTime: string
    timezone: string
    isSameTimezone: boolean
  } | null>(null)

  useEffect(() => {
    // Convert SF time to user's local timezone
    const converted = convertSFTimeToLocal(sfTime)
    setTimeDisplay(converted)
  }, [sfTime])

  if (!timeDisplay) {
    // Fallback while timezone detection is happening
    return <span className={className}>{sfTime}</span>
  }

  const { localTime, timezone, isSameTimezone } = timeDisplay
  const sfTimezoneAbbr = getTimezoneAbbreviation('America/Los_Angeles')
  const localTimezoneAbbr = getTimezoneAbbreviation(timezone)

  // Don't show tooltip if user is in SF timezone or timezone detection failed
  const shouldShowTooltip = !isSameTimezone && timezone !== 'America/Los_Angeles' && showTimezone

  // Default and compact variants - show tooltip on hover
  if (shouldShowTooltip) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className={className}>{sfTime}</span>
        </HoverCardTrigger>
        <HoverCardContent side="right" className="w-auto text-xs p-2">
          <div className="space-y-1 text-sm">
            <div className="font-mono">
              <span className="text-muted-foreground">{sfTimezoneAbbr}</span> {sfTime}{' '}
            </div>
            <div className="font-mono">
              <span className="text-muted-foreground">{localTimezoneAbbr}</span> {localTime}{' '}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }

  // No tooltip needed - just show the time
  return <span className={className}>{sfTime}</span>
}

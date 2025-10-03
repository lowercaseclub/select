'use client'

import { useEffect, useState } from 'react'
import { convertSFTimeToLocal, getTimezoneAbbreviation } from '../lib/timezone-utils'

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
  const timezoneAbbr = getTimezoneAbbreviation(timezone)

  // Don't show localized time if user is in SF timezone or timezone detection failed
  const shouldShowLocalTime = !isSameTimezone && timezone !== 'America/Los_Angeles'

  if (variant === 'compact') {
    return (
      <span className={className}>
        {shouldShowLocalTime ? (
          <>
            {sfTime}{' '}
            {/* <span className="text-muted-foreground text-xs">
              ({localTime} {timezoneAbbr})
            </span> */}
          </>
        ) : (
          sfTime
        )}
      </span>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={className}>
        <div className="font-mono text-sm">{sfTime}</div>
        {!isSameTimezone && timezone !== 'America/Los_Angeles' && (
          <div className="font-mono text-xs text-muted-foreground">
            {localTime} <span className="text-muted-foreground">{timezoneAbbr}</span>
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <span className={className}>
      {isSameTimezone || timezone === 'America/Los_Angeles' ? (
        sfTime
      ) : (
        <>
          {sfTime}
          {showTimezone && (
            <span className="text-muted-foreground text-xs ml-1">
              ({localTime} {timezoneAbbr})
            </span>
          )}
        </>
      )}
    </span>
  )
}

import type { BizzaboSpeaker, ScheduleEvent } from '../types/bizzabo.types'
import { SpeakerDisplay } from './speaker-display'
import { TimezoneTimeDisplay } from './timezone-time-display'

interface ScheduleEventRowProps {
  event: ScheduleEvent
  speakers: BizzaboSpeaker[]
  index: number
}

export function ScheduleEventRow({ event, speakers, index }: ScheduleEventRowProps) {
  const isSpecialEvent =
    event.title.toLowerCase().includes('doors open') ||
    event.title.toLowerCase().includes('lunch') ||
    event.title.toLowerCase().includes('party')
  const displayTitle = event.title

  // Match event speakers with full speaker data
  const eventSpeakers =
    event.speakers
      ?.map((speakerRef) => {
        // Handle both speakerId and id fields
        const speakerId = speakerRef.speakerId || speakerRef.id

        if (!speakerId) {
          console.warn('Speaker reference missing ID:', speakerRef)
          return null
        }

        const matchedSpeaker = speakers.find((speaker) => speaker.id === speakerId)

        if (!matchedSpeaker) {
          console.warn(`Speaker with ID ${speakerId} not found in speakers list`)
          return null
        }

        return matchedSpeaker
      })
      .filter((speaker): speaker is BizzaboSpeaker => speaker !== null) || []

  return (
    <>
      {/* Mobile layout - stacked cards */}
      <div
        className={`md:hidden py-4 border-b border-column-lines hover:bg-muted/20 transition-colors ${
          isSpecialEvent
            ? 'bg-muted/30 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px,transparent_11px)]'
            : ''
        }`}
      >
        <div className="max-w-site mx-auto px-8">
          <div className="space-y-2">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <TimezoneTimeDisplay sfTime={event.time} variant="compact" showTimezone={true} />
            </div>
            <h3 className="font-medium text-base leading-tight">{displayTitle}</h3>
            {eventSpeakers && eventSpeakers.length > 0 && (
              <div className="space-y-1">
                {eventSpeakers.map((speaker, idx) => {
                  const fullName = `${speaker.firstname || ''} ${speaker.lastname || ''}`.trim()
                  const displayName = fullName || speaker.email || `Speaker ${speaker.id}`

                  return (
                    <SpeakerDisplay
                      key={speaker.id || idx}
                      name={displayName}
                      company={speaker.company}
                      title={speaker.title}
                    />
                  )
                })}
              </div>
            )}
            {event.description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
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
            ? 'bg-muted/30 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px,transparent_11px)]'
            : ''
        }`}
      >
        <div className="max-w-site mx-auto px-8 grid grid-cols-12 gap-4">
          <div className="col-span-3 text-sm font-mono">
            <TimezoneTimeDisplay sfTime={event.time} variant="detailed" showTimezone={true} />
          </div>
          <div className="col-span-5">
            <h3 className="font-medium text-lg">{displayTitle}</h3>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">{event.description}</p>
            )}
          </div>
          <div className="col-span-4">
            {eventSpeakers && eventSpeakers.length > 0 && (
              <div className="space-y-1">
                {eventSpeakers.map((speaker, idx) => {
                  const fullName = `${speaker.firstname || ''} ${speaker.lastname || ''}`.trim()
                  const displayName = fullName || speaker.email || `Speaker ${speaker.id}`

                  return (
                    <SpeakerDisplay
                      key={speaker.id || idx}
                      name={displayName}
                      company={speaker.company}
                      title={speaker.title}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

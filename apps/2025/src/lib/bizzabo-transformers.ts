import { BIZZABO_LOCATIONS } from '../types/bizzabo-locations'
import type {
  BizzaboSpeaker,
  BizzaboSession,
  ScheduleEvent,
  SessionSpeakerRef,
} from '../types/bizzabo.types'
import { debug } from './debug'
import { convertMinutesToTimeString } from './timezone-utils'

export function getSpeakerNames(
  sessionSpeakers: SessionSpeakerRef[],
  allSpeakers: BizzaboSpeaker[]
): string {
  return (
    sessionSpeakers
      ?.map((speakerObj) => {
        const speaker = allSpeakers.find((s) => s.id === Number(speakerObj.speakerId))
        return speaker ? `${speaker.firstname || ''} ${speaker.lastname || ''}`.trim() : ''
      })
      .filter(Boolean)
      .join(', ') || ''
  )
}

export function mapLocationToStage(locationId: string): string {
  const location = BIZZABO_LOCATIONS.find((loc) => loc.id === Number(locationId))
  return location ? location.nameId : 'main-stage'
}

export function transformSessionToEvent(session: BizzaboSession): ScheduleEvent {
  debug.log('SESSION OBJECT:', session)
  debug.log('SESSION SPEAKERS:', session.speakers)
  debug.log('SESSION ASSOCIATED CONTACTS:', session.associatedContacts)

  let timeString = 'TBD'

  if (session.startMinute !== undefined && session.endMinute !== undefined) {
    debug.log('FOUND MINUTES:', session.startMinute, session.endMinute)
    timeString = convertMinutesToTimeString(session.startMinute, session.endMinute)
  } else {
    debug.log('NO MINUTES FOUND IN SESSION')
  }

  const stageName = mapLocationToStage(session.locationId.toString())

  return {
    id: session.id.toString(),
    time: timeString,
    title: session.title?.toUpperCase() || '',
    speakers: session.speakers || [],
    stage: stageName,
    description: session.description || '',
    sessionType: session.sessionType,
  }
}

export function sortEventsByTime(events: ScheduleEvent[]): ScheduleEvent[] {
  return events.sort((a, b) => {
    const timeA = a.time.split(' - ')[0]
    const timeB = b.time.split(' - ')[0]

    const getMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }

    return getMinutes(timeA) - getMinutes(timeB)
  })
}

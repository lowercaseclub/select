import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

// San Francisco timezone (America/Los_Angeles)
const SF_TIMEZONE = 'America/Los_Angeles'

export interface TimeDisplay {
  sfTime: string
  localTime: string
  timezone: string
  isSameTimezone: boolean
}

/**
 * Converts minutes from start of day to time string in a specific timezone
 */
export function convertMinutesToTimeString(
  startMinute: number,
  endMinute: number,
  timezone: string = SF_TIMEZONE
): string {
  try {
    // Create a date for today in the specified timezone
    const today = dayjs().tz(timezone)
    const startTime = today.startOf('day').add(startMinute, 'minute')
    const endTime = today.startOf('day').add(endMinute, 'minute')

    return `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`
  } catch (error) {
    console.error('Error converting time:', error)
    return '10:00 - 11:00'
  }
}

/**
 * Gets the user's local timezone from the browser
 */
export function getUserTimezone(): string {
  if (typeof window === 'undefined') {
    return SF_TIMEZONE // Server-side fallback
  }

  try {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    // If timezone detection fails or returns empty string, fall back to SF timezone
    return detectedTimezone || SF_TIMEZONE
  } catch (error) {
    console.warn('Could not detect timezone, falling back to SF timezone:', error)
    return SF_TIMEZONE
  }
}

/**
 * Converts a time string from SF timezone to user's local timezone
 */
export function convertSFTimeToLocal(sfTimeString: string, userTimezone?: string): TimeDisplay {
  const localTz = userTimezone || getUserTimezone()

  try {
    // Parse the SF time string (e.g., "10:00 - 11:30")
    const [startTime, endTime] = sfTimeString.split(' - ')

    if (!startTime || !endTime) {
      throw new Error(`Invalid time format: ${sfTimeString}`)
    }

    // Create today's date in SF timezone
    const today = dayjs().tz(SF_TIMEZONE)
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)

    // Create the start and end times in SF timezone
    const sfStartTime = today.startOf('day').add(startHour, 'hour').add(startMin, 'minute')
    const sfEndTime = today.startOf('day').add(endHour, 'hour').add(endMin, 'minute')

    // Convert to user's local timezone
    const localStartTime = sfStartTime.tz(localTz)
    const localEndTime = sfEndTime.tz(localTz)

    const localTimeString = `${localStartTime.format('HH:mm')} - ${localEndTime.format('HH:mm')}`
    const isSameTimezone = localTz === SF_TIMEZONE

    return {
      sfTime: sfTimeString,
      localTime: localTimeString,
      timezone: localTz,
      isSameTimezone,
    }
  } catch (error) {
    console.error('Error converting SF time to local:', error)
    return {
      sfTime: sfTimeString,
      localTime: sfTimeString,
      timezone: localTz,
      isSameTimezone: false,
    }
  }
}

/**
 * Formats timezone name for display (e.g., "America/Los_Angeles" -> "San Francisco")
 */
export function formatTimezoneName(timezone: string): string {
  const timezoneMap: Record<string, string> = {
    'America/Los_Angeles': 'San Francisco',
    'America/New_York': 'New York',
    'America/Chicago': 'Chicago',
    'America/Denver': 'Denver',
    'Europe/London': 'London',
    'Europe/Paris': 'Paris',
    'Europe/Berlin': 'Berlin',
    'Asia/Tokyo': 'Tokyo',
    'Asia/Shanghai': 'Shanghai',
    'Asia/Kolkata': 'Mumbai',
    'Australia/Sydney': 'Sydney',
    'Pacific/Auckland': 'Auckland',
  }

  return timezoneMap[timezone] || timezone.replace('_', ' ')
}

/**
 * Gets timezone abbreviation (e.g., "PST", "EST", "GMT")
 */
export function getTimezoneAbbreviation(timezone: string): string {
  // Use a comprehensive mapping since dayjs timezone abbreviations can be unreliable
  const timezoneAbbreviations: Record<string, string> = {
    'America/Los_Angeles': 'PST',
    'America/New_York': 'EST',
    'America/Chicago': 'CST',
    'America/Denver': 'MST',
    'America/Phoenix': 'MST',
    'America/Anchorage': 'AKST',
    'Pacific/Honolulu': 'HST',
    'Europe/London': 'GMT',
    'Europe/Paris': 'CET',
    'Europe/Berlin': 'CET',
    'Europe/Rome': 'CET',
    'Europe/Madrid': 'CET',
    'Europe/Amsterdam': 'CET',
    'Europe/Stockholm': 'CET',
    'Europe/Oslo': 'CET',
    'Europe/Copenhagen': 'CET',
    'Europe/Helsinki': 'EET',
    'Europe/Athens': 'EET',
    'Europe/Warsaw': 'CET',
    'Europe/Prague': 'CET',
    'Europe/Budapest': 'CET',
    'Europe/Vienna': 'CET',
    'Europe/Zurich': 'CET',
    'Asia/Tokyo': 'JST',
    'Asia/Shanghai': 'CST',
    'Asia/Hong_Kong': 'HKT',
    'Asia/Singapore': 'SGT',
    'Asia/Seoul': 'KST',
    'Asia/Kolkata': 'IST',
    'Asia/Dubai': 'GST',
    'Asia/Tehran': 'IRST',
    'Asia/Karachi': 'PKT',
    'Asia/Dhaka': 'BST',
    'Asia/Bangkok': 'ICT',
    'Asia/Jakarta': 'WIB',
    'Asia/Manila': 'PHT',
    'Asia/Kuala_Lumpur': 'MYT',
    'Australia/Sydney': 'AEST',
    'Australia/Melbourne': 'AEST',
    'Australia/Brisbane': 'AEST',
    'Australia/Perth': 'AWST',
    'Australia/Adelaide': 'ACST',
    'Pacific/Auckland': 'NZST',
    'Pacific/Fiji': 'FJT',
    'Africa/Cairo': 'EET',
    'Africa/Johannesburg': 'SAST',
    'Africa/Lagos': 'WAT',
    'Africa/Nairobi': 'EAT',
    'America/Sao_Paulo': 'BRT',
    'America/Argentina/Buenos_Aires': 'ART',
    'America/Mexico_City': 'CST',
    'America/Toronto': 'EST',
    'America/Vancouver': 'PST',
    'America/Montreal': 'EST',
  }

  // Return the mapped abbreviation or fallback to a generated one
  return (
    timezoneAbbreviations[timezone] ||
    timezone.split('/').pop()?.substring(0, 3).toUpperCase() ||
    'UTC'
  )
}

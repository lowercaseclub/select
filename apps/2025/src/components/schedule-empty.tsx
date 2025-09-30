interface ScheduleEmptyProps {
  stageName: string
}

export function ScheduleEmpty({ stageName }: ScheduleEmptyProps) {
  return (
    <p className="text-muted-foreground text-center py-8">
      No events scheduled for {stageName} yet.
    </p>
  )
}

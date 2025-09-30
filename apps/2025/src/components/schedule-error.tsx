interface ScheduleErrorProps {
  stageName: string
}

export function ScheduleError({ stageName }: ScheduleErrorProps) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Unable to load {stageName} schedule.</p>
    </div>
  )
}

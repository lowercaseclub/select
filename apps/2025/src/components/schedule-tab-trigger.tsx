import { TabsTrigger } from '@ui/components/tabs'
import type { ComponentProps } from 'react'

interface ScheduleTabTriggerProps extends ComponentProps<typeof TabsTrigger> {
  stageName: string
  className?: string
  value: string
}

export function ScheduleTabTrigger({
  stageName,
  className = '',
  ...props
}: ScheduleTabTriggerProps) {
  return (
    <TabsTrigger
      className={`bg-transparent cursor-pointer border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 py-5 ${className} text-lg md:text-2xl`}
      {...props}
    >
      {stageName}
    </TabsTrigger>
  )
}

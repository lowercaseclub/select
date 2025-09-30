import { TabsContent } from '@ui/components/tabs'
import { ColumnLine } from './column-line'
import { Separator } from '@ui/components/separator'
import { MainStageSchedule } from './main-stage-schedule'
import { BuildStageSchedule } from './build-stage-schedule'
import { ScheduleLocation } from './schedule-location'
import { ScheduleHeader } from './schedule-header'
import locations from '../data/locations.json'

function ScheduleTabContent({
  value,
  locationKey,
  children,
}: {
  value: string
  locationKey: keyof typeof locations
  children: React.ReactNode
}) {
  return (
    <TabsContent value={value} className="mt-0 pb-20 border-b">
      <ScheduleLocation
        locationName={locations[locationKey].locationName}
        locationDisplayName={locations[locationKey].locationDisplayName}
        address={locations[locationKey].address}
        mapUrl={locations[locationKey].mapUrl}
      />
      <ScheduleHeader />
      {children}
    </TabsContent>
  )
}

export function ScheduleSection() {
  return (
    <section id="schedule" className="w-full">
      <div className="relative mx-auto max-w-site">
        <div className="border-l border-r px-8 pt-16 pb-8">
          <ColumnLine />
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight">Schedule</h2>
        </div>
      </div>
      <Separator />
      <ScheduleTabContent value="main" locationKey="main-stage">
        <MainStageSchedule />
      </ScheduleTabContent>
      <ScheduleTabContent value="build" locationKey="build-stage">
        <BuildStageSchedule />
      </ScheduleTabContent>
    </section>
  )
}

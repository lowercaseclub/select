import { Tabs, TabsContent, TabsList } from "@ui/components/tabs";
import { ColumnLine } from "./column-line";
import { Separator } from "@ui/components/separator";
import { MainStageSchedule } from "./main-stage-schedule";
import { BuildStageSchedule } from "./build-stage-schedule";
import { ScheduleTabTrigger } from "./schedule-tab-trigger";

export function ScheduleSection() {
  return (
    <section className="w-full">
      <div className="relative mx-auto max-w-site">
        <div className="border-l border-r px-8 py-16">
          <ColumnLine />
          <h2 className="text-3xl font-medium">Schedule</h2>
        </div>
      </div>
      <Tabs defaultValue="main" className="w-full">
        <div className="max-w-site relative mx-auto">
          <ColumnLine />
          <div className="max-w-site mx-auto px-8 border-l border-r overflow-hidden">
            <TabsList className="bg-transparent h-auto p-0 rounded-none w-full justify-start">
              <ScheduleTabTrigger
                value="main"
                stageName="Main Stage"
                locationName="Union Iron Works"
                locationDisplayName="Union Iron Works"
                address="5 Pier 70 Blvd, San Francisco, CA 94107"
                mapUrl="https://maps.google.com/maps?q=Union%20Iron%20Works,%205%20Pier%2070%20Blvd,%20San%20Francisco,%20CA%2094107&t=&z=17&ie=UTF8&iwloc=&output=embed"
                className="mr-8"
              />
              <ScheduleTabTrigger
                value="build"
                stageName="Build Stage"
                locationName="Y Combinator"
                locationDisplayName="520 YC"
                address="580 20th St, San Francisco, CA 94107"
                mapUrl="https://maps.google.com/maps?q=580%2020th%20Street,%20San%20Francisco,%20CA%2094107&t=&z=17&ie=UTF8&iwloc=&output=embed"
              />
            </TabsList>
          </div>
        </div>
        <Separator />

        <TabsContent value="main" className="mt-8">
          <MainStageSchedule />
        </TabsContent>

        <TabsContent value="build" className="mt-8">
          <BuildStageSchedule />
        </TabsContent>
      </Tabs>
    </section>
  );
}

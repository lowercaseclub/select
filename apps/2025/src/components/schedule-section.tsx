import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { ColumnLine } from "./column-line";
import { Separator } from "@ui/components/separator";
import { getSessions, getSpeakers } from "../lib/bizzabo-api";
import {
  transformSessionToEvent,
  sortEventsByTime,
} from "../lib/bizzabo-transformers";
import {
  BizzaboSession,
  BizzaboSpeaker,
  ScheduleData,
} from "../types/bizzabo.types";

export async function ScheduleSection() {
  // Move ALL API route logic here
  let scheduleData: ScheduleData = { stages: [], events: [] };

  try {
    // Try to fetch sessions and speakers from Bizzabo
    let sessions: BizzaboSession[] = [];
    let speakers: BizzaboSpeaker[] = [];

    try {
      const [sessionsResponse, speakersResponse] = await Promise.all([
        getSessions(),
        getSpeakers(),
      ]);

      sessions = sessionsResponse || [];
      speakers = speakersResponse || [];
      console.log(
        `Successfully fetched ${sessions.length} sessions and ${speakers.length} speakers from Bizzabo`
      );
    } catch (error) {
      console.error(
        "Failed to fetch data from Bizzabo, using fallback data:",
        error
      );
      sessions = [];
      speakers = [];
    }

    // Use hardcoded stages since we don't fetch them from Bizzabo
    const stages = [
      {
        id: 1,
        name: "Main Stage",
        location: "Union Iron Works",
        isActive: true,
      },
      { id: 2, name: "Build Stage", location: "520 YC", isActive: true },
    ];

    // Transform sessions using utility functions
    const transformedEvents = sortEventsByTime(
      sessions.map((session) => transformSessionToEvent(session, speakers))
    );

    // Transform stages to match our component's expected format
    const transformedStages = stages.map((stage) => ({
      name: stage.name,
      location: stage.location,
      active: stage.isActive,
    }));

    scheduleData = {
      stages: transformedStages,
      events: transformedEvents,
    };
  } catch (error) {
    console.error("Error fetching schedule from Bizzabo:", error);
  }

  if (!scheduleData || scheduleData.events.length === 0) {
    return (
      <section className="w-full">
        <div className="relative mx-auto max-w-site">
          <div className="border-l border-r px-8 py-16">
            <ColumnLine />
            <h2 className="text-3xl font-medium">Schedule</h2>
          </div>
        </div>
        <div className="max-w-site mx-auto px-8 py-12 text-center">
          <p className="text-muted-foreground">No events scheduled yet.</p>
        </div>
      </section>
    );
  }

  const mainEvents = scheduleData.events.filter(
    (event) => event.stage === "main-stage" || event.stage === "main"
  );
  const buildEvents = scheduleData.events.filter(
    (event) => event.stage === "build-stage" || event.stage === "build"
  );

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
          <div className="max-w-site mx-auto px-8 border-l border-r">
            <TabsList className="bg-transparent h-auto p-0 border-b border-column-lines">
              <TabsTrigger
                value="main"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-3 mr-8"
              >
                <span className="text-lg font-medium">Main Stage</span>
                <span className="text-muted-foreground data-[state=active]:text-foreground ml-2">
                  @ Union Iron Works
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="build"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-3"
              >
                <span className="text-lg font-medium">Build Stage</span>
                <span className="text-muted-foreground data-[state=active]:text-foreground ml-2">
                  @ 520 YC
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <Separator />

        <TabsContent value="main" className="mt-8">
          <div className="space-y-0">
            {/* Header */}
            <div className="py-4 border-b border-column-lines text-muted-foreground text-sm font-medium">
              <div className="max-w-site mx-auto px-8 grid grid-cols-12 gap-4">
                <div className="col-span-3">TIME</div>
                <div className="col-span-5">TITLE</div>
                <div className="col-span-4">SPEAKERS</div>
              </div>
            </div>

            {/* Events */}
            {mainEvents.map((event) => (
              <div
                key={event.id}
                className="py-6 border-b border-column-lines hover:bg-muted/20 transition-colors"
              >
                <div className="max-w-site mx-auto px-8 grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-sm font-mono">
                    {event.time}
                  </div>
                  <div className="col-span-5">
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="col-span-4 text-muted-foreground">
                    {event.speakers}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="build" className="mt-8">
          <div className="space-y-0">
            {/* Header */}
            <div className="py-4 border-b border-column-lines text-muted-foreground text-sm font-medium">
              <div className="max-w-site mx-auto px-8 grid grid-cols-12 gap-4">
                <div className="col-span-3">TIME</div>
                <div className="col-span-5">TITLE</div>
                <div className="col-span-4">SPEAKERS</div>
              </div>
            </div>

            {/* Events */}
            {buildEvents.map((event) => (
              <div
                key={event.id}
                className="py-6 border-b border-column-lines hover:bg-muted/20 transition-colors"
              >
                <div className="max-w-site mx-auto px-8 grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-sm font-mono">
                    {event.time}
                  </div>
                  <div className="col-span-5">
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="col-span-4 text-muted-foreground">
                    {event.speakers}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

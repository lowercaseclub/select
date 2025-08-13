"use client";

import { useEffect, useState } from "react";
import {
  fetchSchedule,
  DisplayScheduleData,
  DisplayScheduleEvent,
} from "../lib/data-fetcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { ColumnLine } from "./column-line";
import { Separator } from "@ui/components/separator";

export function ScheduleSection() {
  const [scheduleData, setScheduleData] = useState<DisplayScheduleData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      try {
        setIsLoading(true);
        const data = await fetchSchedule();
        setScheduleData(data);
      } catch (err) {
        setError("Failed to load schedule");
        console.error("Error loading schedule:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSchedule();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="relative mx-auto max-w-site">
          <div className="border-l border-r px-8 py-16">
            <ColumnLine />
            <h2 className="text-3xl font-medium">Schedule</h2>
          </div>
        </div>
        <div className="max-w-site mx-auto px-8 py-12">
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !scheduleData) {
    return (
      <section className="w-full">
        <div className="relative mx-auto max-w-site">
          <div className="border-l border-r px-8 py-16">
            <ColumnLine />
            <h2 className="text-3xl font-medium">Schedule</h2>
          </div>
        </div>
        <div className="max-w-site mx-auto px-8 py-12 text-center">
          <p className="text-muted-foreground">
            Unable to load schedule at this time.
          </p>
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

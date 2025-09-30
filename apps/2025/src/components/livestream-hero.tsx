"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { useStage } from "../contexts/stage-context";

// YouTube livestream URLs - replace with actual stream URLs when available
const STREAM_URLS = {
  main: "https://www.youtube.com/embed/live_stream?channel=YOUR_MAIN_CHANNEL_ID",
  build: "https://www.youtube.com/embed/live_stream?channel=YOUR_BUILD_CHANNEL_ID",
};

export function LivestreamHero() {
  const { activeStage, setActiveStage } = useStage();
  const [isPlaying] = useState(true);
  const [isMuted] = useState(false);

  const handleStageChange = (stage: string) => {
    setActiveStage(stage as "main" | "build");
  };

  return (
    <section className="px-8 pt-0 pb-16 md:pb-32">
      <div className="flex flex-col gap-y-6">
        {/* <div className="flex flex-col gap-2">
          <p className="text-gray-400 text-2xl md:text-3xl">Live Now</p>
          <h1 className="text-3xl md:text-4xl font-medium">
            Supabase Select 2025
          </h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-lg text-gray-300">
              {isLive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div> */}

        {/* Stage Selection Tabs */}
        <Tabs defaultValue="main" value={activeStage} onValueChange={handleStageChange} className="w-full">
          {/* <TabsList className="bg-transparent h-auto p-0 rounded-none w-full justify-start flex gap-6 border-b border-gray-800">
            <TabsTrigger 
              value="main" 
              className="bg-transparent border-none rounded-none px-0 py-4 text-xl font-medium data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent"
            >
              Main Stage
            </TabsTrigger>
            <TabsTrigger 
              value="build" 
              className="bg-transparent border-none rounded-none px-0 py-4 text-xl font-medium data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent"
            >
              Build Stage
            </TabsTrigger>
          </TabsList> */}

          {/* Main Stage Stream */}
          <TabsContent value="main" className="w-full mt-6 border border-blue-400">
            <div className="relative w-full aspect-video bg-black overflow-hidden border !rounded-none">
              <iframe
                src={`${STREAM_URLS.main}&autoplay=${isPlaying ? '1' : '0'}&mute=${isMuted ? '1' : '0'}`}
                title="Main Stage Live Stream"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              {/* <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={togglePlayPause}
                  className="bg-black/50 hover:bg-black/70 border border-white/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleMute}
                  className="bg-black/50 hover:bg-black/70 border border-white/20"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div> */}
            </div>
          </TabsContent>

          {/* Build Stage Stream */}
          <TabsContent value="build" className="mt-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-800">
              <iframe
                src={`${STREAM_URLS.build}&autoplay=${isPlaying ? '1' : '0'}&mute=${isMuted ? '1' : '0'}`}
                title="Build Stage Live Stream"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
{/*               
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={togglePlayPause}
                  className="bg-black/50 hover:bg-black/70 border border-white/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleMute}
                  className="bg-black/50 hover:bg-black/70 border border-white/20"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div> */}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stream Info */}
        <div className="flex flex-col gap-2 text-sm text-gray-400">
          <p>
            Currently streaming: <span className="text-white font-medium">
              {activeStage === "main" ? "Main Stage" : "Build Stage"}
            </span>
          </p>
          <div>
            <time dateTime="2025-10-03">Friday, October 3, 2025</time> • 
            <address className="inline not-italic">Y Combinator, 580 20th St, San Francisco</address>
          </div>
        </div>
      </div>
    </section>
  );
}

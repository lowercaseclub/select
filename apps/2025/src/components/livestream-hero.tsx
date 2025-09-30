import { TabsContent } from '@ui/components/tabs'

const STREAM_URLS = {
  main: 'https://www.youtube-nocookie.com/embed/MAIN_VIDEO_ID',
  build: 'https://www.youtube-nocookie.com/embed/BUILD_VIDEO_ID',
}

export function LivestreamHero() {
  return (
    <section className="relative px-8 pt-4 pb-6 border-b" style={{ marginTop: 'var(--header-height)' }}>
      {Object.entries(STREAM_URLS).map(([stageKey, streamUrl]) => {
        const stageName = stageKey === 'main' ? 'Main Stage' : 'Build Stage'

        return (
          <TabsContent key={stageKey} value={stageKey} className="w-full h-full m-0">
            <div className="h-auto max-h-[calc(100dvh-32px-var(--header-height))] border max-w-full relative overflow-hidden group aspect-video mx-auto">
               <iframe
                 src={`${streamUrl}?autoplay=1&enablejsapi=1&origin=https%3A%2F%supabase.com&rel=0&modestbranding=1&theme=dark`}
                 title={`${stageName} Live Stream`}
                 className="w-full h-full bg-transparent focus:!outline-none [*]:!outline-none [*]:focus:!ring-0"
                 style={{ outline: 'none', border: 'none' }}
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
               />
            </div>
          </TabsContent>
        )
      })}
    </section>
  )
}

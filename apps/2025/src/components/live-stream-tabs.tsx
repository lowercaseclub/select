import { ContentWrapper } from './content-wrapper'
import { Header } from './header'
import { LivestreamHero } from './livestream-hero'
import { ScheduleSection } from './schedule-section'
import { StagesTabsClient } from './stages-tabs-client'

const LiveStreamTabs = () => {
  return (
    <StagesTabsClient>
      <Header />
      <ContentWrapper>
        <div className="relative border-b" style={{ marginTop: 'var(--header-height)' }}>
          {/* <div className="absolute top-32 left-0 right-0 bottom-0 pointer-events-none">
            <AnimatedGrid />
          </div> */}
          <LivestreamHero />
        </div>
      </ContentWrapper>
      <ScheduleSection />
    </StagesTabsClient>
  )
}

export default LiveStreamTabs

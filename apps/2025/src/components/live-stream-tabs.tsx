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
        <LivestreamHero />
      </ContentWrapper>
      <ScheduleSection />
    </StagesTabsClient>
  )
}

export default LiveStreamTabs

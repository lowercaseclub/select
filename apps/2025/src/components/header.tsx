'use client'

import Link from 'next/link'
import Logo from './logo'
import { ContentWrapper } from './content-wrapper'
import { TabsList } from '@repo/ui/src/components/tabs'
import { ScheduleTabTrigger } from './schedule-tab-trigger'
import { useHeaderHeight } from '../hooks/use-header-height'

export function Header() {
  const headerRef = useHeaderHeight()

  return (
    <header ref={headerRef} className="bg-background border-b fixed top-0 left-0 right-0 z-50">
      <ContentWrapper className="">
        <div className="px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="h-7 sm:h-8 md:h-10">
              <Logo />
            </Link>
          </div>

          <TabsList className="bg-transparent h-auto p-0 rounded-none justify-start flex gap-6">
            <ScheduleTabTrigger value="main" stageName="Main Stage" />
            <ScheduleTabTrigger value="build" stageName="Build Stage" />
          </TabsList>
        </div>
      </ContentWrapper>
    </header>
  )
}

'use client'

import { Tabs } from '@ui/components/tabs'
import { useStage } from '../contexts/stage-context'

interface StagesTabsClientProps {
  children: React.ReactNode
}

export function StagesTabsClient({ children }: StagesTabsClientProps) {
  const { activeStage, setActiveStage } = useStage()

  const handleStageChange = (stage: string) => {
    setActiveStage(stage as 'main' | 'build')
  }

  return (
    <Tabs value={activeStage} onValueChange={handleStageChange} className="w-full">
      {children}
    </Tabs>
  )
}

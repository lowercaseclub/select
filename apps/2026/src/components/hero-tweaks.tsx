'use client'

import { useEffect, type RefObject } from 'react'
import { Leva, useControls } from 'leva'
import { SIM } from '@/lib/hero/sim'
import type { HeroEngine } from '@/lib/hero/engine'

/**
 * Dev-only leva panel for tuning the hero sim live. Values are pushed into
 * the running engine on every change; `speed` scales the tick cadence.
 */
export default function HeroTweaks({
  engineRef,
}: {
  engineRef: RefObject<HeroEngine | null>
}) {
  const params = useControls('hero sim', {
    speed: { value: 1, min: 0.25, max: 4, step: 0.05 },
    birthMax: { value: SIM.birthMax, min: 0, max: 1, step: 0.01 },
    birthFloor: { value: SIM.birthFloor, min: 0, max: 0.3, step: 0.005 },
    birthDecayTau: { value: SIM.birthDecayTau, min: 30, max: 800, step: 10 },
    deathRate: { value: SIM.deathRate, min: 0, max: 0.12, step: 0.001 },
    contagion: { value: SIM.contagion, min: 0, max: 4, step: 0.05 },
    lowWater: { value: SIM.lowWater, min: 0, max: 0.4, step: 0.01 },
    highWater: { value: SIM.highWater, min: 0.02, max: 0.5, step: 0.01 },
    centerCalm: { value: SIM.centerCalm, min: 0, max: 1, step: 0.05 },
    graceTicks: { value: SIM.graceTicks, min: 0, max: 80, step: 1 },
    agingTau: { value: SIM.agingTau, min: 40, max: 800, step: 10 },
    extentGuard: { value: SIM.extentGuard, min: 0, max: 1, step: 0.01 },
    splitAliveChance: { value: SIM.splitAliveChance, min: 0, max: 0.05, step: 0.001 },
    splitEmptyChance: { value: SIM.splitEmptyChance, min: 0, max: 0.2, step: 0.005 },
    mergeChance: { value: SIM.mergeChance, min: 0, max: 0.2, step: 0.005 },
  })

  useEffect(() => {
    engineRef.current?.setParams(params)
  })

  return <Leva collapsed />
}

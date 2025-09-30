import { useState } from 'react'

export interface AnimationControls {
  enableColorAnimations: boolean
  enableCellMovement: boolean
  enableColumnMorphing: boolean
  enableSelections: boolean
  cellMovementSpeed: number // Multiplier for actual movement animation speed
  columnMorphSpeed: number // Multiplier for column morphing animation speed
  selectionFrequency: number // Multiplier for selection creation frequency
  cellMovementInterval: number // How often cells move (multiplier for intervals)
  columnMorphInterval: number // How often columns morph (multiplier for intervals)
  selectionInterval: number // How often selections are created (multiplier for intervals)
  maxSelections: number // Maximum number of simultaneous selections
}

const defaultControls: AnimationControls = {
  enableColorAnimations: true,
  enableCellMovement: true,
  enableColumnMorphing: true,
  enableSelections: true,
  cellMovementSpeed: 1,
  columnMorphSpeed: 1,
  selectionFrequency: 1,
  cellMovementInterval: 1,
  columnMorphInterval: 1,
  selectionInterval: 1,
  maxSelections: 2,
}

export function useAnimationControls() {
  const [controls, setControls] = useState<AnimationControls>(defaultControls)
  const [showControls, setShowControls] = useState(false)

  const updateControl = <K extends keyof AnimationControls>(
    key: K,
    value: AnimationControls[K]
  ) => {
    setControls((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetControls = () => {
    setControls(defaultControls)
  }

  const toggleControls = () => {
    setShowControls((prev) => !prev)
  }

  return {
    controls,
    showControls,
    updateControl,
    resetControls,
    toggleControls,
  }
}

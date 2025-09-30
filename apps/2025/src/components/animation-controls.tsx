'use client'

import { Button } from '@ui/components/button'
import { Label } from '@ui/components/label'
import { Slider } from '@ui/components/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/components/popover'
import { AnimationControls } from '../hooks/use-animation-controls'

interface AnimationControlsProps {
  controls: AnimationControls
  onUpdateControl: <K extends keyof AnimationControls>(key: K, value: AnimationControls[K]) => void
  onResetControls: () => void
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function AnimationControlsPanel({
  controls,
  onUpdateControl,
  onResetControls,
  onOpenChange,
  children,
}: AnimationControlsProps) {
  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto" side="left" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Animation Controls</h3>
            <Button onClick={onResetControls} variant="ghost" size="sm" className="text-xs">
              Reset
            </Button>
          </div>

          {/* Toggle Controls */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Enable/Disable Features</h4>

            <div className="space-y-2">
              <ToggleControl
                label="Color Animations"
                checked={controls.enableColorAnimations}
                onChange={(checked) => onUpdateControl('enableColorAnimations', checked)}
              />

              <ToggleControl
                label="Cell Movement"
                checked={controls.enableCellMovement}
                onChange={(checked) => onUpdateControl('enableCellMovement', checked)}
              />

              <ToggleControl
                label="Column Morphing"
                checked={controls.enableColumnMorphing}
                onChange={(checked) => onUpdateControl('enableColumnMorphing', checked)}
              />

              <ToggleControl
                label="Selections"
                checked={controls.enableSelections}
                onChange={(checked) => onUpdateControl('enableSelections', checked)}
              />
            </div>
          </div>

          {/* Speed Controls */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Animation Speed</h4>

            <div className="space-y-3">
              <SliderControl
                label="Cell Movement Speed"
                value={controls.cellMovementSpeed}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(value) => onUpdateControl('cellMovementSpeed', value)}
              />

              <SliderControl
                label="Column Morph Speed"
                value={controls.columnMorphSpeed}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(value) => onUpdateControl('columnMorphSpeed', value)}
              />

              <SliderControl
                label="Selection Frequency"
                value={controls.selectionFrequency}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(value) => onUpdateControl('selectionFrequency', value)}
              />
            </div>
          </div>

          {/* Interval Controls */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Trigger Intervals</h4>

            <div className="space-y-3">
              <SliderControl
                label="Cell Movement Interval"
                value={controls.cellMovementInterval}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(value) => onUpdateControl('cellMovementInterval', value)}
              />

              <SliderControl
                label="Column Morph Interval"
                value={controls.columnMorphInterval}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(value) => onUpdateControl('columnMorphInterval', value)}
              />

              <SliderControl
                label="Selection Interval"
                value={controls.selectionInterval}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(value) => onUpdateControl('selectionInterval', value)}
              />
            </div>
          </div>

          {/* Count Controls */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Limits</h4>

            <SliderControl
              label="Max Selections"
              value={controls.maxSelections}
              min={0}
              max={5}
              step={1}
              onChange={(value) => onUpdateControl('maxSelections', value)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ToggleControlProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleControl({ label, checked, onChange }: ToggleControlProps) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-background transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function SliderControl({ label, value, min, max, step, onChange }: SliderControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="text-xs text-muted-foreground font-mono">{value.toFixed(1)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
        className="w-full"
      />
    </div>
  )
}

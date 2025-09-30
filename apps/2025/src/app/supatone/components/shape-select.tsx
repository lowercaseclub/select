'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/src/components/select'

interface ShapeSelectProps {
  value: 'circle' | 'square'
  onValueChange: (value: 'circle' | 'square') => void
}

export function ShapeSelect({ value, onValueChange }: ShapeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-black border-column-lines font-mono">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-black border-column-lines">
        <SelectItem value="circle" className="font-mono">
          <span className="flex items-center gap-2">
            <span className="text-brand-green-default">●</span>
            Circle
          </span>
        </SelectItem>
        <SelectItem value="square" className="font-mono">
          <span className="flex items-center gap-2">
            <span className="text-brand-green-default">■</span>
            Square
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

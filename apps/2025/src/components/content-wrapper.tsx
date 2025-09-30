import { ReactNode } from 'react'
import { ColumnLine } from './column-line'
import { cn } from '@repo/ui/src/lib/utils'

interface ContentWrapperProps {
  children: ReactNode
  className?: string
}

export function ContentWrapper({ children, className }: ContentWrapperProps) {
  return (
    <div className={cn('lg:mx-8', className)}>
      <div className="relative overflow-hidden border-l border-r border-column-lines max-w-site mx-auto">
        <ColumnLine />
        {children}
        <ColumnLine className="left-auto right-8" />
      </div>
    </div>
  )
}

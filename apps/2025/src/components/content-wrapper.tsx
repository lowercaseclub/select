import { ReactNode } from 'react'
import { ColumnLine } from './column-line'
import { cn } from '@repo/ui/src/lib/utils'

interface ContentWrapperProps {
  children: ReactNode
  className?: string
  hasColumnLine?: boolean
}

export function ContentWrapper({ children, className, hasColumnLine = true }: ContentWrapperProps) {
  return (
    <div className={cn('lg:mx-8', className)}>
      <div className="relative overflow-hidden lg:border-l lg:border-r border-column-lines max-w-site mx-auto">
        {hasColumnLine && <ColumnLine />}
        {children}
        {hasColumnLine && <ColumnLine className="left-auto right-8" />}
      </div>
    </div>
  )
}

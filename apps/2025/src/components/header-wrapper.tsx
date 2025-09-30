import { ReactNode } from 'react'
import { ColumnLine } from './column-line'

interface HeaderWrapperProps {
  children: ReactNode
}

export function HeaderWrapper({ children }: HeaderWrapperProps) {
  return (
    <div className="relative overflow-hidden border-b border-l border-r border-column-lines max-w-site mx-auto">
      <ColumnLine />
      <div className="absolute border-t w-full h-px top-24"></div>
      <div className="absolute border-t w-full h-px top-32"></div>
      {children}
    </div>
  )
}

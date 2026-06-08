import { cn } from '@/lib/cn'

/** Centered content column — mirrors the ~1104px content width of the design. */
export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('mx-auto w-full max-w-[1104px] px-6', className)}>{children}</div>
}

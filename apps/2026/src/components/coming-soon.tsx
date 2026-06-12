import { cn } from '@/lib/cn'

/** Bordered placeholder with a corner-to-corner X and a "COMING SOON" chip. */
export function ComingSoonFrame({
  className,
  label = 'COMING SOON',
}: {
  className?: string
  label?: string
}) {
  return (
    <div className={cn('relative overflow-hidden border border-hairline', className)}>
      <svg
        className="absolute left-0 top-0 h-full w-full md:left-[10px] md:top-[10px] md:h-[calc(100%-20px)] md:w-[calc(100%-20px)]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="#D3CFCB" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#D3CFCB" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#d9d9d9] px-2 py-px font-mono text-[12px] font-medium leading-[14px] text-black/30 md:px-4">
        {label}
      </span>
    </div>
  )
}

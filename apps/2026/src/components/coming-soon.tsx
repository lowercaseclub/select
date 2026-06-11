import { cn } from '@/lib/cn'

/** Bordered placeholder with a diagonal slash and a "COMING SOON" chip. */
export function ComingSoonFrame({
  className,
  label = 'COMING SOON',
}: {
  className?: string
  label?: string
}) {
  return (
    <div className={cn('relative border border-hairline', className)}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="#D3CFCB" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#d9d9d9] px-4 py-1 font-mono text-[12px] font-medium leading-4 tracking-[0.02em] text-black/30">
        {label}
      </span>
    </div>
  )
}

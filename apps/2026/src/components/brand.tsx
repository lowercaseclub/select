import { cn } from '@/lib/cn'

/**
 * The pixel-matrix "Select" wordmark.
 * Rendered as a CSS mask so one asset can be recoloured by `currentColor`.
 * `solid` fills the letterforms (hero); `outline` is the inside-stroke export (footer).
 */
export function SelectWordmark({
  className,
  variant = 'solid',
}: {
  className?: string
  variant?: 'solid' | 'outline'
}) {
  const solid = variant === 'solid'
  const src = solid ? '/img/select-solid.svg' : '/img/select-wordmark.svg'
  return (
    <div
      role="img"
      aria-label="Select"
      className={cn('bg-current', className)}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: solid ? 'left center' : 'center',
        maskPosition: solid ? 'left center' : 'center',
        aspectRatio: solid ? '191 / 55' : '1103.01 / 315.796',
      }}
    />
  )
}

/** Supabase icon + wordmark lockup. */
export function SupabaseLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-[8px]', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/supabase-icon.svg" alt="" className="h-[22px] w-auto" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/supabase-wordmark.svg" alt="Supabase" className="h-[18px] w-auto" />
    </span>
  )
}

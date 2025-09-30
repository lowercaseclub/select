export function ScheduleLoading() {
  return (
    <section className="w-full">
      <div className="relative mx-auto max-w-site">
        <div className="border-l border-r px-8 py-16">
          <div className="h-8 bg-muted animate-pulse rounded mb-4 w-32"></div>
        </div>
      </div>
      <div className="max-w-site mx-auto px-8 py-12">
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-16 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

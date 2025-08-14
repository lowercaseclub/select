export function SpeakersLoading() {
  return (
    <section className="px-8 py-24">
      <div className="mb-16">
        <h2 className="text-3xl font-medium mb-4">Featured Speakers</h2>
        <p className="text-lg text-muted-foreground">
          Learn from industry leaders and successful founders who are shaping
          the future of technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-4 animate-pulse">
            <div className="aspect-square bg-muted border border-column-lines"></div>
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
              <div className="space-y-1">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

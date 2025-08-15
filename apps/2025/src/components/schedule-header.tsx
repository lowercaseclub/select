export function ScheduleHeader() {
  return (
    <div className="hidden md:block py-4 border-b border-column-lines text-muted-foreground text-sm font-medium">
      <div className="max-w-site mx-auto px-8 grid grid-cols-12 gap-4">
        <div className="col-span-3">TIME</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-4">SPEAKERS</div>
      </div>
    </div>
  );
}

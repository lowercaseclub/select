import { ModeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M8 0L16 8L8 16L0 8L8 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium tracking-tight">
            Supabase Select
          </h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}

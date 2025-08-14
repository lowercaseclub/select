import { ModeToggle } from "./theme-toggle";
import Logo from "./logo";

export function Header() {
  return (
    <header className="p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6">
            <Logo />
          </div>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}

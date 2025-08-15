import Link from "next/link";
import Logo from "./logo";

export function Header() {
  return (
    <header className="p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-7 sm:h-8 md:h-10">
            <Logo />
          </Link>
        </div>
      </div>
    </header>
  );
}

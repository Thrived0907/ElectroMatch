import Link from "next/link";
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ⚡ ElectroMatch AI
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/wizard">Find a device</Link>
          <Link href="/search">Search</Link>
          <Link href="/chat">AI Chat</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>

        <div>
          <button className="border rounded px-3 py-1">
            Guest Mode
          </button>
        </div>
      </div>
    </header>
  );
}
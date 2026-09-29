import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-[0.2em]">
          LUNA
        </Link>

        <nav className="hidden gap-6 text-sm md:flex">
          <Link href="/#services">Услуги</Link>
          <Link href="/#masters">Мастера</Link>
          <Link href="/works">Работы</Link>
          <Link href="/#booking">Запись</Link>
        </nav>

        <Link href="/#booking" className="btn-primary py-2.5">
          Записаться
        </Link>
      </div>
    </header>
  );
}

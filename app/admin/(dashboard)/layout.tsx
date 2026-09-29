import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f7f4f2]">
      <header className="border-b border-black/5 bg-white">
        <div className="container-shell flex min-h-16 items-center justify-between gap-4">
          <Link href="/admin" className="font-semibold">
            LUNA Admin
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/" className="rounded-full border border-black/10 px-4 py-2">← На сайт</Link>
            <Link href="/admin">Обзор</Link>
            <Link href="/admin/home">Главная</Link>
            <Link href="/admin/gallery">Работы</Link>
            <Link href="/admin/masters">Мастера</Link>
            <Link href="/admin/bookings">Записи</Link>
            <Link href="/admin/services">Услуги</Link>

            <form action={logoutAction}>
              <button className="rounded-full border border-black/10 px-4 py-2">
                Выйти
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="container-shell py-10">{children}</main>
    </div>
  );
}

import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [bookings, newBookings, services] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.service.count({ where: { active: true } })
  ]);

  const cards = [
    ["Всего записей", bookings],
    ["Новых заявок", newBookings],
    ["Активных услуг", services]
  ];

  return (
    <div>
      <h1 className="text-4xl font-semibold">Панель управления</h1>
      <p className="mt-2 text-cocoa/60">Краткая статистика салона.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="card p-6">
            <p className="text-sm text-cocoa/55">{label}</p>
            <p className="mt-3 text-4xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

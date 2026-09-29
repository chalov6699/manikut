import { prisma } from "@/lib/prisma";
import { updateBookingStatusAction } from "@/app/admin/actions";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  isBookingStatus
} from "@/lib/booking-status";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { service: true, master: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-4xl font-semibold">Записи</h1>
      <div className="mt-8 space-y-4">
        {bookings.length === 0 && (
          <div className="card p-6 text-cocoa/60">Заявок пока нет.</div>
        )}

        {bookings.map((booking) => {
          const safeStatus = isBookingStatus(booking.status)
            ? booking.status
            : "NEW";

          return (
            <div
              key={booking.id}
              className="card grid gap-5 p-6 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold">{booking.client}</h2>
                  <span className="rounded-full bg-blush px-3 py-1 text-xs text-rosewood">
                    {BOOKING_STATUS_LABELS[safeStatus]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-cocoa/60">
                  {booking.phone}
                  {booking.email ? ` · ${booking.email}` : ""}
                </p>
                <p className="mt-3 text-sm">
                  {booking.service.name}
                  {booking.master ? ` · ${booking.master.name}` : ""}
                </p>
              </div>

              <div className="text-sm text-cocoa/70">
                <p>
                  {new Intl.DateTimeFormat("ru-RU", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  }).format(booking.date)}
                </p>
                {booking.comment && <p className="mt-2">{booking.comment}</p>}
              </div>

              <form action={updateBookingStatusAction} className="flex gap-2">
                <input type="hidden" name="id" value={booking.id} />
                <select
                  className="input min-w-40"
                  name="status"
                  defaultValue={safeStatus}
                >
                  {BOOKING_STATUSES.map((status) => (
                    <option value={status} key={status}>
                      {BOOKING_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                <button className="btn-secondary">Сохранить</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { createServiceAction, toggleServiceAction } from "@/app/admin/actions";
import { formatPrice } from "@/lib/utils";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
      <div>
        <h1 className="text-4xl font-semibold">Услуги</h1>
        <form action={createServiceAction} className="card mt-8 space-y-4 p-6">
          <div>
            <label className="label">Название</label>
            <input name="name" className="input" required />
          </div>
          <div>
            <label className="label">Описание</label>
            <textarea name="description" className="input min-h-28" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Цена, ₽</label>
              <input name="price" type="number" min="0" className="input" required />
            </div>
            <div>
              <label className="label">Длительность, мин</label>
              <input name="durationMin" type="number" min="15" step="15" className="input" defaultValue="60" required />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="featured" type="checkbox" />
            Показывать как популярную
          </label>
          <button className="btn-primary">Добавить услугу</button>
        </form>
      </div>

      <div className="space-y-4 lg:pt-[4.5rem]">
        {services.map((service) => (
          <div key={service.id} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-semibold">{service.name}</h2>
                {!service.active && <span className="rounded-full bg-black/5 px-3 py-1 text-xs">Скрыта</span>}
              </div>
              <p className="mt-1 text-sm text-cocoa/55">{formatPrice(service.price)} · {service.durationMin} мин</p>
            </div>
            <form action={toggleServiceAction}>
              <input type="hidden" name="id" value={service.id} />
              <input type="hidden" name="active" value={String(service.active)} />
              <button className="btn-secondary">{service.active ? "Скрыть" : "Показать"}</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

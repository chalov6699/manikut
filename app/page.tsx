import Image from "next/image";
import Link from "next/link";
import { Sparkles, Clock3, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { BookingForm } from "@/components/BookingForm";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, masters, settings, gallery] = await Promise.all([
    prisma.service.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { createdAt: "asc" }]
    }),
    prisma.master.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.siteSettings.findUnique({
      where: { id: "main" }
    }),
    prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);

  return (
    <main>
      <Header />

      <section className="overflow-hidden">
        <div className="container-shell grid min-h-[640px] items-center gap-10 py-20 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <span className="inline-flex rounded-full bg-blush px-4 py-2 text-sm font-medium text-rosewood">
              Красивые ногти без спешки
            </span>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
              Маникюр, который выглядит дорого и носится долго.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa/65">
              Уютный салон LUNA: аккуратная обработка, стойкое покрытие,
              деликатный дизайн и запись без звонков.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#booking" className="btn-primary">
                Записаться онлайн
              </a>
              <Link href="/works" className="btn-secondary">
                Смотреть работы
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5" />
                Стерильные инструменты
              </div>
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5" />
                Без ожидания
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5" />
                Premium-материалы
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="card relative aspect-[4/5] overflow-hidden">
              {settings?.heroImageUrl ? (
                <>
                  <Image
                    src={settings.heroImageUrl}
                    alt="Маникюр в салоне LUNA"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8 pt-24 text-white">
                    <p className="text-sm uppercase tracking-[0.2em]">
                      LUNA studio
                    </p>
                    <p className="mt-3 text-3xl font-semibold">
                      Нежный сервис. Чистая эстетика.
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-full bg-[radial-gradient(circle_at_top,#f8e7eb,transparent_60%),linear-gradient(160deg,#fff,#f6eee9)] p-8">
                  <div className="flex h-full flex-col justify-end rounded-[2rem] border border-white/70 bg-white/40 p-8 backdrop-blur">
                    <p className="text-sm uppercase tracking-[0.2em] text-rosewood">
                      LUNA studio
                    </p>
                    <p className="mt-4 text-3xl font-semibold">
                      Нежный сервис. Чистая эстетика.
                    </p>
                    <p className="mt-3 text-cocoa/60">
                      Каждая запись — отдельное время для вас.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-20">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rosewood">
              Услуги
            </p>
            <h2 className="mt-3 text-4xl font-semibold">
              Популярные процедуры
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  {service.featured && (
                    <span className="rounded-full bg-blush px-3 py-1 text-xs text-rosewood">
                      Хит
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-cocoa/60">
                  {service.description}
                </p>

                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-semibold">
                      {formatPrice(service.price)}
                    </p>
                    <p className="text-sm text-cocoa/50">
                      {service.durationMin} мин
                    </p>
                  </div>

                  <a href="#booking" className="btn-secondary py-2">
                    Выбрать
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="py-20">
          <div className="container-shell">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rosewood">
                  Наши работы
                </p>
                <h2 className="mt-3 text-4xl font-semibold">
                  Свежие примеры
                </h2>
              </div>

              <Link href="/works" className="btn-secondary">
                Открыть всю галерею
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {gallery.map((item) => (
                <Link
                  href="/works"
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-3xl"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 pt-16 text-white">
                    <p className="font-medium">{item.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="masters" className="bg-white py-20">
        <div className="container-shell">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rosewood">
            Команда
          </p>
          <h2 className="mt-3 text-4xl font-semibold">Мастера LUNA</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {masters.map((master) => (
              <article key={master.id} className="card p-7">
                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full bg-blush">
                    {master.imageUrl ? (
                      <Image
                        src={master.imageUrl}
                        alt={master.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-2xl font-semibold text-rosewood">
                        {master.name.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold">{master.name}</h3>
                    <p className="text-rosewood">{master.role}</p>
                  </div>
                </div>

                <p className="mt-5 leading-7 text-cocoa/60">{master.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="bg-blush/55 py-20">
        <div className="container-shell">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rosewood">
              Онлайн-запись
            </p>
            <h2 className="mt-3 text-4xl font-semibold">
              Выберите удобное время
            </h2>
            <p className="mt-4 text-cocoa/60">
              После заявки администратор свяжется с вами и подтвердит визит.
            </p>
          </div>

          <BookingForm
            services={services.map(({ id, name }) => ({ id, name }))}
            masters={masters.map(({ id, name }) => ({ id, name }))}
          />
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white py-10">
        <div className="container-shell flex flex-col gap-3 text-sm text-cocoa/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LUNA Nails</p>
          <Link href="/admin/login" className="hover:text-cocoa">
            Вход для администратора
          </Link>
        </div>
      </footer>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <main>
      <Header />

      <section className="py-16 sm:py-20">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rosewood">
              Галерея
            </p>
            <h1 className="mt-3 text-5xl font-semibold">
              Примеры наших работ
            </h1>
            <p className="mt-5 leading-7 text-cocoa/60">
              Идеи покрытий, форм и дизайнов, которые можно повторить или взять за основу.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="card mt-10 p-8 text-cocoa/60">
              Галерея пока пустая. Скоро здесь появятся новые работы.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article key={item.id} className="card overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    {item.description && (
                      <p className="mt-2 text-sm leading-6 text-cocoa/60">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12">
            <Link href="/#booking" className="btn-primary">
              Записаться на маникюр
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

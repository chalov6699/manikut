import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  createGalleryItemAction,
  deleteGalleryItemAction
} from "@/app/admin/actions";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-4xl font-semibold">Примеры работ</h1>
      <p className="mt-2 text-cocoa/60">
        Добавляйте фотографии, которые будут показаны на странице работ.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <form
          action={createGalleryItemAction}
          className="card space-y-4 p-6"
          encType="multipart/form-data"
        >
          <div>
            <label className="label">Название</label>
            <input className="input" name="title" required />
          </div>

          <div>
            <label className="label">Описание</label>
            <textarea
              className="input min-h-28"
              name="description"
              placeholder="Например: молочная база, тонкие линии..."
            />
          </div>

          <div>
            <label className="label">Фото</label>
            <input
              className="input"
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              required
            />
            <p className="mt-2 text-xs text-cocoa/50">
              JPG, PNG или WEBP, до 5 МБ.
            </p>
          </div>

          <button className="btn-primary">Добавить работу</button>
        </form>

        <div className="grid gap-5 sm:grid-cols-2">
          {items.length === 0 && (
            <div className="card p-6 text-cocoa/60 sm:col-span-2">
              Работ пока нет.
            </div>
          )}

          {items.map((item) => (
            <article key={item.id} className="card overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h2 className="font-semibold">{item.title}</h2>
                {item.description && (
                  <p className="mt-2 text-sm leading-6 text-cocoa/60">
                    {item.description}
                  </p>
                )}

                <form action={deleteGalleryItemAction} className="mt-4">
                  <input type="hidden" name="id" value={item.id} />
                  <button className="btn-secondary w-full">
                    Удалить
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

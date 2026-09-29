import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  createMasterAction,
  deleteMasterAction,
  removeMasterPhotoAction,
  toggleMasterAction,
  updateMasterAction
} from "@/app/admin/actions";

export default async function AdminMastersPage() {
  const masters = await prisma.master.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <div>
      <h1 className="text-4xl font-semibold">Мастера</h1>
      <p className="mt-2 text-cocoa/60">
        Добавляйте мастеров, меняйте информацию и фотографии.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <form
          action={createMasterAction}
          className="card space-y-4 p-6"
          encType="multipart/form-data"
        >
          <h2 className="text-xl font-semibold">Добавить мастера</h2>

          <div>
            <label className="label">Имя</label>
            <input className="input" name="name" required />
          </div>

          <div>
            <label className="label">Должность</label>
            <input
              className="input"
              name="role"
              placeholder="Например: Топ-мастер"
              required
            />
          </div>

          <div>
            <label className="label">Описание</label>
            <textarea
              className="input min-h-28"
              name="bio"
              required
            />
          </div>

          <div>
            <label className="label">Фото</label>
            <input
              className="input"
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
            />
            <p className="mt-2 text-xs text-cocoa/50">
              JPG, PNG или WEBP, до 5 МБ.
            </p>
          </div>

          <button className="btn-primary">Добавить мастера</button>
        </form>

        <div className="space-y-6">
          {masters.length === 0 && (
            <div className="card p-6 text-cocoa/60">
              Мастеров пока нет.
            </div>
          )}

          {masters.map((master) => (
            <article key={master.id} className="card overflow-hidden">
              <div className="grid gap-6 p-6 md:grid-cols-[140px_1fr]">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-3xl bg-blush">
                    {master.imageUrl ? (
                      <Image
                        src={master.imageUrl}
                        alt={master.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-4xl font-semibold text-rosewood">
                        {master.name.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  {master.imageUrl && (
                    <form action={removeMasterPhotoAction} className="mt-3">
                      <input type="hidden" name="id" value={master.id} />
                      <button className="btn-secondary w-full py-2 text-sm">
                        Удалить фото
                      </button>
                    </form>
                  )}
                </div>

                <form
                  action={updateMasterAction}
                  encType="multipart/form-data"
                  className="space-y-4"
                >
                  <input type="hidden" name="id" value={master.id} />

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium">
                      {master.active ? "Показывается на сайте" : "Скрыт"}
                    </span>
                  </div>

                  <div>
                    <label className="label">Имя</label>
                    <input
                      className="input"
                      name="name"
                      defaultValue={master.name}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Должность</label>
                    <input
                      className="input"
                      name="role"
                      defaultValue={master.role}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Описание</label>
                    <textarea
                      className="input min-h-24"
                      name="bio"
                      defaultValue={master.bio}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Заменить фото</label>
                    <input
                      className="input"
                      type="file"
                      name="image"
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </div>

                  <button className="btn-primary">Сохранить изменения</button>
                </form>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-black/5 bg-black/[0.015] p-4">
                <form action={toggleMasterAction}>
                  <input type="hidden" name="id" value={master.id} />
                  <input
                    type="hidden"
                    name="active"
                    value={String(master.active)}
                  />
                  <button className="btn-secondary py-2">
                    {master.active ? "Скрыть с сайта" : "Показать на сайте"}
                  </button>
                </form>

                <form action={deleteMasterAction}>
                  <input type="hidden" name="id" value={master.id} />
                  <button className="rounded-full border border-red-200 bg-white px-5 py-2 font-medium text-red-700 transition hover:bg-red-50">
                    Удалить мастера
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

import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  removeHeroImageAction,
  updateHeroImageAction
} from "@/app/admin/actions";

export default async function AdminHomePage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "main" }
  });

  return (
    <div>
      <h1 className="text-4xl font-semibold">Главная страница</h1>
      <p className="mt-2 text-cocoa/60">
        Здесь можно менять главное фото на первом экране сайта.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form
          action={updateHeroImageAction}
          className="card space-y-5 p-6"
          encType="multipart/form-data"
        >
          <div>
            <label className="label">Новое фото</label>
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

          <button className="btn-primary">Установить фото</button>
        </form>

        <div className="card overflow-hidden p-4">
          {settings?.heroImageUrl ? (
            <>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={settings.heroImageUrl}
                  alt="Главное фото сайта"
                  fill
                  className="object-cover"
                />
              </div>

              <form action={removeHeroImageAction} className="mt-4">
                <button className="btn-secondary w-full">
                  Удалить фото
                </button>
              </form>
            </>
          ) : (
            <div className="grid aspect-[4/5] place-items-center rounded-2xl bg-blush text-center text-cocoa/50">
              Главное фото пока не установлено.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

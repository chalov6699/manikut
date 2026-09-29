"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, getSession } from "@/lib/auth";
import { isBookingStatus } from "@/lib/booking-status";
import { deleteLocalImage, saveImage } from "@/lib/uploads";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    redirect("/admin/login?error=1");
  }

  await createSession(admin.id);
  redirect("/admin");
}

export async function logoutAction() {
  clearSession();
  redirect("/admin/login");
}

export async function createServiceAction(formData: FormData) {
  await requireAdmin();

  await prisma.service.create({
    data: {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price") || 0),
      durationMin: Number(formData.get("durationMin") || 60),
      featured: formData.get("featured") === "on",
      active: true
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function toggleServiceAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const active = String(formData.get("active")) === "true";

  await prisma.service.update({
    where: { id },
    data: { active: !active }
  });

  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function updateBookingStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  if (!isBookingStatus(status)) return;

  await prisma.booking.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function updateHeroImageAction(formData: FormData) {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File)) {
    throw new Error("Изображение не выбрано.");
  }

  const current = await prisma.siteSettings.findUnique({
    where: { id: "main" }
  });

  const imageUrl = await saveImage(file);

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: { heroImageUrl: imageUrl },
    create: { id: "main", heroImageUrl: imageUrl }
  });

  await deleteLocalImage(current?.heroImageUrl);

  revalidatePath("/");
  revalidatePath("/admin/home");
}

export async function removeHeroImageAction() {
  await requireAdmin();

  const current = await prisma.siteSettings.findUnique({
    where: { id: "main" }
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: { heroImageUrl: null },
    create: { id: "main", heroImageUrl: null }
  });

  await deleteLocalImage(current?.heroImageUrl);

  revalidatePath("/");
  revalidatePath("/admin/home");
}

export async function createGalleryItemAction(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const file = formData.get("image");

  if (!title) {
    throw new Error("Укажите название работы.");
  }

  if (!(file instanceof File)) {
    throw new Error("Изображение не выбрано.");
  }

  const imageUrl = await saveImage(file);

  await prisma.galleryItem.create({
    data: {
      title,
      description: description || null,
      imageUrl
    }
  });

  revalidatePath("/");
  revalidatePath("/works");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryItemAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const item = await prisma.galleryItem.findUnique({ where: { id } });

  if (!item) return;

  await prisma.galleryItem.delete({ where: { id } });
  await deleteLocalImage(item.imageUrl);

  revalidatePath("/");
  revalidatePath("/works");
  revalidatePath("/admin/gallery");
}

export async function createMasterAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const file = formData.get("image");

  if (!name || !role || !bio) {
    throw new Error("Заполните имя, должность и описание мастера.");
  }

  let imageUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    imageUrl = await saveImage(file);
  }

  await prisma.master.create({
    data: {
      name,
      role,
      bio,
      imageUrl,
      active: true
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/masters");
}

export async function updateMasterAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const file = formData.get("image");

  if (!id || !name || !role || !bio) {
    throw new Error("Заполните обязательные поля.");
  }

  const current = await prisma.master.findUnique({ where: { id } });
  if (!current) return;

  let imageUrl = current.imageUrl;

  if (file instanceof File && file.size > 0) {
    const newImageUrl = await saveImage(file);
    await deleteLocalImage(current.imageUrl);
    imageUrl = newImageUrl;
  }

  await prisma.master.update({
    where: { id },
    data: {
      name,
      role,
      bio,
      imageUrl
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/masters");
}

export async function toggleMasterAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const active = String(formData.get("active")) === "true";

  await prisma.master.update({
    where: { id },
    data: { active: !active }
  });

  revalidatePath("/");
  revalidatePath("/admin/masters");
}

export async function removeMasterPhotoAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const master = await prisma.master.findUnique({ where: { id } });

  if (!master) return;

  await prisma.master.update({
    where: { id },
    data: { imageUrl: null }
  });

  await deleteLocalImage(master.imageUrl);

  revalidatePath("/");
  revalidatePath("/admin/masters");
}

export async function deleteMasterAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const master = await prisma.master.findUnique({ where: { id } });

  if (!master) return;

  await prisma.$transaction([
    prisma.booking.updateMany({
      where: { masterId: id },
      data: { masterId: null }
    }),
    prisma.master.delete({
      where: { id }
    })
  ]);

  await deleteLocalImage(master.imageUrl);

  revalidatePath("/");
  revalidatePath("/admin/masters");
  revalidatePath("/admin/bookings");
}

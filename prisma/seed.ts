import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "change-me";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash }
  });

  const services = [
    {
      name: "Маникюр + покрытие",
      description: "Комбинированный маникюр, выравнивание и стойкое покрытие.",
      price: 2800,
      durationMin: 120,
      featured: true
    },
    {
      name: "Маникюр без покрытия",
      description: "Уход за ногтями и кутикулой, полировка и масло.",
      price: 1700,
      durationMin: 60,
      featured: true
    },
    {
      name: "Укрепление ногтей",
      description: "Укрепление натуральной ногтевой пластины с покрытием.",
      price: 3300,
      durationMin: 150,
      featured: false
    }
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) await prisma.service.create({ data: service });
  }

  const masters = [
    {
      name: "Анна",
      role: "Топ-мастер",
      bio: "Специализация: аккуратный комбинированный маникюр и сложные оттенки."
    },
    {
      name: "Мария",
      role: "Nail-мастер",
      bio: "Специализация: укрепление, минималистичный дизайн и натуральные формы."
    }
  ];

  for (const master of masters) {
    const existing = await prisma.master.findFirst({ where: { name: master.name } });
    if (!existing) await prisma.master.create({ data: master });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

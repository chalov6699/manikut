import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bookingSchema = z.object({
  client: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal("")),
  date: z.string().min(1),
  serviceId: z.string().min(1),
  masterId: z.string().optional(),
  comment: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const input = bookingSchema.parse(await request.json());

    const booking = await prisma.booking.create({
      data: {
        client: input.client,
        phone: input.phone,
        email: input.email || null,
        date: new Date(input.date),
        serviceId: input.serviceId,
        masterId: input.masterId || null,
        comment: input.comment || null
      }
    });

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Проверьте заполненные поля." }, { status: 400 });
  }
}

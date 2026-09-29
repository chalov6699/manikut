"use client";

import { useState } from "react";

type Service = { id: string; name: string };
type Master = { id: string; name: string };

export function BookingForm({
  services,
  masters
}: {
  services: Service[];
  masters: Master[];
}) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");

    const response = await fetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    setPending(false);
    setMessage(response.ok ? "Спасибо! Мы свяжемся с вами для подтверждения записи." : data.error || "Не удалось отправить заявку.");
  }

  return (
    <form
      className="card grid gap-4 p-6 md:grid-cols-2"
      action={async (formData) => {
        await submit(formData);
      }}
    >
      <div>
        <label className="label">Ваше имя</label>
        <input className="input" name="client" required />
      </div>
      <div>
        <label className="label">Телефон</label>
        <input className="input" name="phone" required />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" name="email" type="email" />
      </div>
      <div>
        <label className="label">Дата и время</label>
        <input className="input" name="date" type="datetime-local" required />
      </div>
      <div>
        <label className="label">Услуга</label>
        <select className="input" name="serviceId" required defaultValue="">
          <option value="" disabled>Выберите услугу</option>
          {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Мастер</label>
        <select className="input" name="masterId" defaultValue="">
          <option value="">Любой мастер</option>
          {masters.map((master) => <option key={master.id} value={master.id}>{master.name}</option>)}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="label">Комментарий</label>
        <textarea className="input min-h-28 resize-y" name="comment" />
      </div>
      <div className="md:col-span-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button disabled={pending} className="btn-primary disabled:opacity-50">
          {pending ? "Отправка..." : "Оставить заявку"}
        </button>
        {message && <p className="text-sm text-cocoa/70">{message}</p>}
      </div>
    </form>
  );
}

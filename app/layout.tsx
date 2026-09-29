import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUNA Nails — салон маникюра",
  description: "Маникюр, покрытие и nail-дизайн. Онлайн-запись в уютный салон."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

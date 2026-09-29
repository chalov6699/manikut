# Manicure Salon

Сайт салона маникюра на Next.js + TypeScript + Tailwind CSS + Prisma + SQLite.

## Возможности

- публичная главная страница;
- загрузка главного фото из админ-панели;
- каталог услуг;
- мастера;
- онлайн-заявка на запись;
- публичная страница `/works` с примерами работ;
- добавление и удаление работ из админ-панели;
- загрузка изображений JPG / PNG / WEBP до 5 МБ;
- управление услугами;
- управление статусами записей;
- авторизация администратора;
- Prisma + SQLite.

Загруженные изображения сохраняются локально в `public/uploads`.

## Первый запуск

Откройте PowerShell в папке проекта:

```powershell
Copy-Item .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Если вы обновляете уже запущенную предыдущую версию

После замены файлов проекта выполните:

```powershell
npm install
npx prisma generate
npx prisma migrate dev --name gallery-and-hero
npm run dev
```

`prisma migrate dev` добавит таблицы `SiteSettings` и `GalleryItem`.

## Адреса

- Сайт: http://localhost:3000
- Работы: http://localhost:3000/works
- Админка: http://localhost:3000/admin/login
- Управление фото главной: http://localhost:3000/admin/home
- Управление работами: http://localhost:3000/admin/gallery

Данные администратора по умолчанию:

- Email: `admin@example.com`
- Пароль: `change-me`

После смены `ADMIN_PASSWORD` в `.env` выполните:

```powershell
npm run prisma:seed
```

## Важно для хостинга

Текущая загрузка фото хранит файлы на локальном диске сервера (`public/uploads`).
Для Vercel и других serverless-платформ лучше подключить S3, Cloudinary, UploadThing
или другое постоянное файловое хранилище.

- Управление мастерами: http://localhost:3000/admin/masters

import { loginAction } from "@/app/admin/actions";

export default function AdminLoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-blush/50 p-4">
      <div className="card w-full max-w-md p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rosewood">LUNA Admin</p>
        <h1 className="mt-3 text-3xl font-semibold">Вход в панель</h1>
        <form action={loginAction} className="mt-8 space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" name="email" required />
          </div>
          <div>
            <label className="label">Пароль</label>
            <input className="input" type="password" name="password" required />
          </div>
          {searchParams.error && <p className="text-sm text-red-600">Неверный email или пароль.</p>}
          <button className="btn-primary w-full">Войти</button>
        </form>
      </div>
    </main>
  );
}

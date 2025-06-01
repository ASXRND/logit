// импорт звездного поля
import StarField from '../../components/StarField';

export default function DashboardPage() {
  return (
    <div className="relative flex min-h-screen text-white overflow-hidden">
      {/* Звёздное небо на заднем плане */}
      <StarField />

      {/* Сайдбар */}
      <aside className="w-64 bg-white/10 backdrop-blur-md p-6 border-r border-white/10 z-10">
        <h2 className="text-2xl font-bold mb-6">Панель</h2>
        <ul className="space-y-4 text-sm font-medium">
          <li className="hover:text-blue-400 transition cursor-pointer">Главная</li>
          <li className="hover:text-blue-400 transition cursor-pointer">Профиль</li>
          <li className="hover:text-blue-400 transition cursor-pointer">Настройки</li>
        </ul>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-10 animate-fadeIn">Добро пожаловать!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow hover:shadow-lg transition duration-300">
            <h3 className="text-lg font-semibold mb-2">Пользователи</h3>
            <p className="text-3xl font-bold">128</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow hover:shadow-lg transition duration-300">
            <h3 className="text-lg font-semibold mb-2">Активные</h3>
            <p className="text-3xl font-bold">83</p>
          </div>
        </div>
      </main>
    </div>
  );
}

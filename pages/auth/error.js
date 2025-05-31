import { useRouter } from "next/router";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const errors = {
    Configuration: "Произошла проблема с конфигурацией сервера.",
    AccessDenied: "Доступ запрещен. У вас нет прав для входа на эту страницу.",
    Verification: "Ссылка для верификации недействительна или просрочена.",
    default: "Произошла непредвиденная ошибка при аутентификации.",
  };

  const errorMessage = error && errors[error] ? errors[error] : errors.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка аутентификации</h1>
        <p className="text-gray-600">{errorMessage}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}

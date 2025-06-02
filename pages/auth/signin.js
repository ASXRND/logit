import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SignIn({ providers }) {
  const router = useRouter();
  const { callbackUrl = "/" } = router.query;

  return (
    <>
      <Head>
        <title>Вход в LogIt</title>
        <meta name="description" content="Вход в личный рабочий журнал менеджера LogIt" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mb-4 shadow-lg">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="white"/>
                <rect x="6" y="6" width="28" height="28" rx="4" fill="#000"/>
                <rect x="12" y="12" width="16" height="16" rx="2" fill="white"/>
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Вход в LogIt</h1>
            <p className="text-gray-500 text-center text-base mb-2">Личный рабочий журнал менеджера</p>
            <p className="text-gray-400 text-center text-sm">Авторизация через Google, GitHub, почту и др.</p>
          </div>
          <div className="w-full flex flex-col gap-4 mt-4">
            {providers && Object.values(providers).length > 0 ? (
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold text-lg shadow hover:from-blue-600 hover:to-blue-800 transition"
                  onClick={() => signIn(provider.id, { callbackUrl })}
                >
                  <span className="inline-block align-middle">
                    {provider.name === "Google" && (
                      <svg width="22" height="22" viewBox="0 0 48 48" fill="none"><g><path d="M44.5 20H24V28.5H36.5C35.5 32 32.5 35 28 35C22.5 35 18 30.5 18 25C18 19.5 22.5 15 28 15C30.5 15 32.5 16 34 17.5L39.5 12C36.5 9.5 32.5 8 28 8C17.5 8 9 16.5 9 27C9 37.5 17.5 46 28 46C38.5 46 47 37.5 47 27C47 25.5 46.5 23.5 46 22L44.5 20Z" fill="#4285F4"/><path d="M6 14.5L13.5 20.5C15.5 17.5 18.5 15 22 15C24.5 15 26.5 16 28 17.5L33.5 12C30.5 9.5 26.5 8 22 8C14.5 8 8 14.5 8 22C8 24.5 8.5 27 10 29L6 14.5Z" fill="#34A853"/><path d="M24 46C29.5 46 34.5 43.5 37.5 39.5L30.5 34.5C29 36 26.5 37 24 37C20.5 37 17.5 35 15.5 32L8 38.5C11.5 43.5 17.5 46 24 46Z" fill="#FBBC05"/><path d="M44.5 20H24V28.5H36.5C35.5 32 32.5 35 28 35C22.5 35 18 30.5 18 25C18 19.5 22.5 15 28 15C30.5 15 32.5 16 34 17.5L39.5 12C36.5 9.5 32.5 8 28 8C17.5 8 9 16.5 9 27C9 37.5 17.5 46 28 46C38.5 46 47 37.5 47 27C47 25.5 46.5 23.5 46 22L44.5 20Z" fill="#EA4335"/></g></svg>
                    )}
                    {provider.name === "GitHub" && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 5.06 20.17 9.26 21.5C9.86 21.59 10.08 21.27 10.08 21V19.13C7.73 19.63 7.22 18.19 7.22 18.19C6.68 16.97 5.89 16.66 5.89 16.66C4.82 15.97 5.97 15.99 5.97 15.99C7.15 16.08 7.76 17.19 7.76 17.19C8.81 19.01 10.54 18.5 11.19 18.23C11.29 17.45 11.61 16.92 11.97 16.62C9.73 16.37 7.39 15.39 7.39 11.5C7.39 10.39 7.81 9.5 8.5 8.8C8.39 8.54 8.04 7.5 8.61 6.13C8.61 6.13 9.5 5.84 12 7.38C13.02 7.09 14.09 6.95 15.16 6.95C16.23 6.95 17.3 7.09 18.32 7.38C20.82 5.84 21.71 6.13 21.71 6.13C22.28 7.5 21.93 8.54 21.82 8.8C22.51 9.5 22.93 10.39 22.93 11.5C22.93 15.4 20.59 16.36 18.35 16.61C18.81 17 19.22 17.77 19.22 18.91V21C19.22 21.27 19.44 21.59 20.04 21.5C24.24 20.17 27.3 16.42 27.3 12C27.3 6.48 22.82 2 17.3 2H12Z" fill="#181717"/></svg>
                    )}
                  </span>
                  Войти через {provider.name}
                </button>
              ))
            ) : (
              <div className="text-center text-red-500">Провайдеры авторизации не найдены. Попробуйте позже.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers: providers || null },
  };
}

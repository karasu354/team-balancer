import type { AppProps } from 'next/app'

import './globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="fixed top-0 left-0 z-50 h-20 w-full bg-white shadow-md">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between p-4 text-gray-800">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Team Balancer ロゴ" className="h-8 w-8" />
            <div className="text-2xl font-bold">Team Balancer</div>
          </div>
        </nav>
      </header>

      <div className="pt-20">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp

import type { AppProps } from 'next/app'

import './globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="w-full border-b-2 border-gray-200 bg-white">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt="Team Balancer Logo" className="h-8 w-8" />
            <div className="text-2xl font-bold text-blue-500">
              TEAM BALANCER
            </div>
          </div>
        </nav>
      </header>

      <div className="">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp

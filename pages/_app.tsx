import type { AppProps } from 'next/app'

import './globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50">
        <nav className="flex justify-between items-center w-full max-w-6xl mx-auto p-4 text-gray-800">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Team Balancer ロゴ" className="w-8 h-8" />
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

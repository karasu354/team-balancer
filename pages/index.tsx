import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold">Welcome to Team Division</h1>
        <p className="text-lg mt-2">
          A simple Next.js and Tailwind CSS project
        </p>
      </header>

      <main className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg text-gray-800">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Fast and scalable web applications</li>
          <li>Beautiful UI with Tailwind CSS</li>
          <li>Easy to customize and extend</li>
        </ul>
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </main>

      <footer className="mt-8 text-gray-200">
        <p>&copy; 2025 Team Division. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home

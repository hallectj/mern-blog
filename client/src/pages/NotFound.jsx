import React from 'react'

export default function NotFound() {
  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen font-sans">
      <div className="text-center">
        <div className="text-6xl font-bold text-teal-500">404</div>
        <div className="text-xl text-gray-700">Oops! Page not found.</div>
        <a href="/" className="mt-4 text-blue-500 hover:text-blue-700 font-bold">Back to Home</a>
      </div>
    </div>
  )
}

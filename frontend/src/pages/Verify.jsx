import React from "react"

export default function Verify() {
  return (
    <div className="relative w-full min-h-screen bg-pink-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">
          Check your email
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          We’ve sent you an email with a link to verify your account. Please
          check your inbox and click on the link to complete your verification
          process.
        </p>
        <div className="mt-6">
          <p className="text-gray-500 text-xs">
            Didn’t receive the email?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Resend link
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

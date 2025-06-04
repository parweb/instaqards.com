'use client';

import Link from 'next/link';
import { uri } from 'settings';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-9xl font-extrabold text-transparent drop-shadow-sm">
            404
          </h1>

          {/* Error Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Page non trouvée
            </h2>
            <p className="mx-auto max-w-sm text-lg text-gray-600">
              Désolé, la page que vous recherchez n'existe pas ou a été
              déplacée.
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex justify-center">
          <div className="flex h-40 w-64 items-center justify-center rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 opacity-20">
            <svg
              className="h-20 w-20 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Return Home Button */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex transform items-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-lg transition hover:scale-105 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Retour à l'accueil
          </Link>

          {/* Additional Help */}
          <p className="text-sm text-gray-500">
            Vous pouvez aussi essayer de{' '}
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 underline hover:text-blue-800 focus:outline-none"
            >
              revenir en arrière
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link'

export default function Header() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-medium-logo text-2xl text-black hover:text-black">
            dmtrung14&apos;s Journal
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Write
          </Link>
        </div>
      </div>
    </nav>
  )
}


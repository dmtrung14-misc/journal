import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { format } from 'date-fns'
import Link from 'next/link'
import Header from '@/components/Header'

// Dynamic rendering - posts are fetched from Firebase at request time
export const dynamic = 'force-dynamic'

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">{post.title}</h1>
          <p className="text-gray-500">
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </p>
        </header>

        <div className="max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to all posts
          </Link>
        </div>
      </article>
    </div>
  )
}


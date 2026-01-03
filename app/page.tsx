import Link from 'next/link'
import { getPosts } from '@/lib/posts'
import { format } from 'date-fns'
import Header from '@/components/Header'
import ProfileHeader from '@/components/ProfileHeader'

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader />

        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts yet. Check back soon!</p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-gray-200 pb-8 last:border-b-0 cursor-pointer"
              >
                <Link href={`/posts/${post.slug}`} className="block">
                  <h2 className="text-2xl font-bold text-gray-900 hover:text-black mb-3 font-serif">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-gray-700 line-clamp-3 text-lg leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium">
                    Read more →
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}


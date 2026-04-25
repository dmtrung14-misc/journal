'use client'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
}

interface PostListProps {
  posts: Post[]
  onEdit: (slug: string) => void
  onDelete: (slug: string) => void
}

export default function PostList({ posts, onEdit, onDelete }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No posts yet. Create your first post!
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[55%] min-w-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="w-[25%] min-w-[9rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.slug}>
                <td className="min-w-0 max-w-0 px-6 py-4 align-top">
                  <div className="break-words text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                  <div className="mt-1 line-clamp-2 break-words text-sm text-gray-500">
                    {post.excerpt}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm font-medium">
                  <button
                    onClick={() => onEdit(post.slug)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(post.slug)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


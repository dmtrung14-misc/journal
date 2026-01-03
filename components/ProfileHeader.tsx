import { getProfile } from '@/lib/profile'
import Image from 'next/image'

export default async function ProfileHeader() {
  const profile = await getProfile()

  return (
    <div className="mb-12">
      {/* Banner */}
      {profile.banner && (
        <div className="w-full h-64 bg-gray-200 mb-8 overflow-hidden">
          <img
            src={profile.banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={profile.profilePic}
              alt={profile.fullName}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized={profile.profilePic.startsWith('/')}
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {profile.fullName}
          </h1>
          <p className="text-gray-500 mb-4">@{profile.username}</p>
          
          {profile.description && (
            <p className="text-gray-700 text-lg mb-4 max-w-2xl">
              {profile.description}
            </p>
          )}

          {/* Follow Button and Stats */}
          <div className="flex items-center gap-6">
            <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
              Follow
            </button>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>
                <strong className="text-gray-900">{profile.followers}</strong>{' '}
                Followers
              </span>
              <span>
                <strong className="text-gray-900">{profile.following}</strong>{' '}
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


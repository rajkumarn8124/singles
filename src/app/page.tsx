import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

async function getProfiles(searchName?: string) {
  const userId = getSessionUserId();
  
  // Base query: verified users with profiles
  let whereClause: any = {
    isVerified: true,
    profile: { isNot: null },
  };

  if (userId) {
    whereClause.id = { not: userId };
  }

  if (searchName) {
    whereClause.name = searchName;
  } else if (userId) {
    // If no search, filter by interestedIn
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    
    if (currentUser?.profile?.interestedIn && currentUser.profile.interestedIn !== "All") {
      whereClause.profile = {
        ...whereClause.profile,
        gender: currentUser.profile.interestedIn
      };
    }
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      profile: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return users;
}

export default async function HomePage({ searchParams }: { searchParams: { search?: string } }) {
  const searchName = searchParams.search;
  const users = await getProfiles(searchName);

  return (
    <div className="space-y-8 mt-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Meet Amazing Singles</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Browse verified profiles and connect with people who match your vibe. Your privacy is our priority.</p>
        
        <form action="/" method="GET" className="max-w-md mx-auto flex gap-2">
          <input 
            type="text" 
            name="search" 
            placeholder="Search for an exact profile name..." 
            defaultValue={searchName} 
            className="flex-1 rounded-full border-gray-300 shadow-sm px-4 py-2 border focus:ring-red-500 focus:border-red-500" 
          />
          <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 font-medium">Search</button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="aspect-[4/5] bg-gray-100 relative">
              {user.profile?.imageUrl ? (
                <img src={user.profile.imageUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold flex items-center justify-between">
                <span>{user.name} <span className="text-sm font-normal text-gray-500">{user.profile?.gender}</span></span>
                {user.profile?.age && <span className="text-gray-500 font-normal">{user.profile.age}</span>}
              </h2>
              {user.profile?.personalityTags && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {user.profile.personalityTags.split(",").map((tag, i) => (
                    <span key={i} className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">{tag.trim()}</span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{user.profile?.bio}</p>
              
              <Link href={`/chat/${user.id}`} className="mt-4 block text-center w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition">
                Message
              </Link>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No profiles found yet. Be the first to join!
          </div>
        )}
      </div>
    </div>
  );
}

import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function HomePage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const tag = typeof searchParams?.tag === 'string' ? searchParams.tag : undefined;

  let whereClause: any = { status: "PUBLISHED" };

  if (tag) {
    whereClause = {
      ...whereClause,
      OR: [
        { title: { contains: tag } },
        { content: { contains: tag } },
        { seoKeywords: { contains: tag } }
      ]
    };
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" }
  });

  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 4);
  const remainingPosts = posts.slice(4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-900 dark:text-gray-300 text-lg">No published posts yet.</div>
        ) : (
          <div className="space-y-16">
            {/* Top Section: Featured + Side Posts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Featured Post (Left, spans 2 columns) */}
              {featuredPost && (
                <article className="lg:col-span-2 relative group flex flex-col items-start justify-start">
                  {featuredPost.coverImage && (
                    <div className="w-full mb-6">
                      <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full h-[400px] object-cover rounded-xl" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-start w-full">
                    <div>
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime={featuredPost.createdAt.toISOString()} className="text-gray-900 dark:text-gray-400">
                          {format(new Date(featuredPost.createdAt), "MMMM d, yyyy")}
                        </time>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-3xl font-bold leading-9 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-3">
                          <Link href={`/post/${featuredPost.slug}`}>
                            <span className="absolute inset-0" />
                            {featuredPost.title}
                          </Link>
                        </h3>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white font-bold z-10 relative">
                        {(featuredPost.authorName || "E")[0].toUpperCase()}
                      </div>
                      <div className="text-sm leading-6 z-10 relative">
                        <p className="font-semibold text-gray-900 dark:text-white">{featuredPost.authorName || "Editor"}</p>
                        <p className="text-gray-900 dark:text-gray-400">Author</p>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Side Posts (Right, 1 column) */}
              {sidePosts.length > 0 && (
                <div className="flex flex-col gap-8">
                  {sidePosts.map((post) => (
                    <article key={post.id} className="relative group flex flex-col gap-2 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-x-4 text-xs mb-2">
                          <time dateTime={post.createdAt.toISOString()} className="text-gray-900 dark:text-gray-400">
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </time>
                        </div>
                        <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          <Link href={`/post/${post.slug}`}>
                            <span className="absolute inset-0" />
                            {post.title}
                          </Link>
                        </h3>
                        <div className="mt-3 flex items-center gap-x-3">
                          <div className="text-sm leading-5 z-10 relative">
                            <span className="font-semibold text-gray-900 dark:text-gray-300">{post.authorName || "Editor"}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Grid for Remaining Posts */}
            {remainingPosts.length > 0 && (
              <div>
                <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">More Posts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {remainingPosts.map((post) => (
                    <article key={post.id} className="relative group flex flex-col items-start justify-start">
                      {post.coverImage && (
                        <div className="w-full mb-4">
                          <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover rounded-xl" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-start w-full">
                        <div>
                          <div className="flex items-center gap-x-4 text-xs">
                            <time dateTime={post.createdAt.toISOString()} className="text-gray-900 dark:text-gray-400">
                              {format(new Date(post.createdAt), "MMMM d, yyyy")}
                            </time>
                          </div>
                          <div className="mt-3">
                            <h3 className="text-xl font-bold leading-6 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                              <Link href={`/post/${post.slug}`}>
                                <span className="absolute inset-0" />
                                {post.title}
                              </Link>
                            </h3>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-x-4">
                          <div className="text-sm leading-6 z-10 relative">
                            <span className="font-semibold text-gray-900 dark:text-gray-300">{post.authorName || "Editor"}</span>
                          </div>
                        </div>
                      </div>

                      
                            <h3 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-3">Insights & Perspectives</h3>
                  <p className="text-lg text-gray-900 dark:text-gray-300 max-w-2xl">Deep dives, expert analysis, and breaking stories curated by our editorial team.</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

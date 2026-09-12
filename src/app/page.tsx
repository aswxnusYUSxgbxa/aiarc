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
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#0a0a0a]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-900 dark:text-gray-300 text-lg">No published posts yet.</div>
        ) : (
          <div className="space-y-16">
            {/* Top Section: Featured + Side Posts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Featured Post (Left, spans 2 columns) */}
              {featuredPost && (
                <article className="lg:col-span-2 relative group flex flex-col items-start justify-start border-t-4 border-black dark:border-white pt-6">
                  {featuredPost.coverImage && (
                    <div className="w-full mb-6 overflow-hidden rounded-xl">
                      <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-start w-full">
                    <div>
                      <div className="flex items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-400 mb-2">
                        <time dateTime={featuredPost.createdAt.toISOString()}>
                          {format(new Date(featuredPost.createdAt), "MMM d, yyyy")}
                        </time>
                        <span>•</span>
                        <span>{featuredPost.authorName || "Editor"}</span>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-4xl font-serif font-bold leading-[1.15] text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-3">
                          <Link href={`/post/${featuredPost.slug}`}>
                            <span className="absolute inset-0" />
                            {featuredPost.title}
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Side Posts (Right, 1 column) */}
              {sidePosts.length > 0 && (
                <div className="flex flex-col gap-6">
                  {sidePosts.map((post) => (
                    <article key={post.id} className="relative group flex flex-col gap-2 items-start border-b border-black dark:border-white pb-6 last:border-0 last:pb-0">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-400 mb-2">
                          <time dateTime={post.createdAt.toISOString()}>
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </time>
                          <span>•</span>
                          <span>{post.authorName || "Editor"}</span>
                        </div>
                        <h3 className="text-xl font-serif font-bold leading-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          <Link href={`/post/${post.slug}`}>
                            <span className="absolute inset-0" />
                            {post.title}
                          </Link>
                        </h3>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Grid for Remaining Posts */}
            {remainingPosts.length > 0 && (
              <div className="mt-16 pt-8 border-t-4 border-black dark:border-white">
                <div className="mb-8 border-b border-black dark:border-white pb-8">
                  <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 dark:text-white mb-2">More Posts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-4">
                  {remainingPosts.map((post) => (
                    <article key={post.id} className="relative group flex flex-col items-start justify-start border-t border-black dark:border-white pt-5">
                      {post.coverImage && (
                        <div className="w-full mb-4 overflow-hidden rounded-xl">
                          <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-start w-full">
                        <div>
                          <div className="flex items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-400 mb-2">
                            <time dateTime={post.createdAt.toISOString()}>
                              {format(new Date(post.createdAt), "MMM d, yyyy")}
                            </time>
                            <span>•</span>
                            <span>{post.authorName || "Editor"}</span>
                          </div>
                          <div className="mt-2">
                            <h3 className="text-xl font-serif font-bold leading-snug text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                              <Link href={`/post/${post.slug}`}>
                                <span className="absolute inset-0" />
                                {post.title}
                              </Link>
                            </h3>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-16 pt-8 border-t-4 border-black dark:border-white">
                  <h3 className="text-4xl font-serif font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-3">Insights & Perspectives</h3>
                  <p className="text-lg text-gray-900 dark:text-gray-300 max-w-2xl">Deep dives, expert analysis, and breaking stories curated by our editorial team.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

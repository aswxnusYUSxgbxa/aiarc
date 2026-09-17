import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug: slug } });
  if (!post) return { title: "Post Not Found" };

  const baseKeywords = ["betting", "cricket", "football", "sports", "news", "creative blog site", "latest insights", "top topics"];
  const postKeywords = post.seoKeywords
    ? post.seoKeywords.split(',').map(k => k.trim())
    : [];

  const finalKeywords = Array.from(new Set([...postKeywords, ...baseKeywords]));

  return {
    title: `${post.title} | newnblog`,
    description: post.seoKeywords ? `Read about ${post.seoKeywords}` : post.title,
    keywords: finalKeywords,
    openGraph: { images: post.coverImage ? [post.coverImage] : [] }
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Find and update the view count in one operation
  const post = await prisma.post.update({
    where: { slug: slug },
    data: { viewCount: { increment: 1 } }
  }).catch(() => null);


  if (!post || post.status !== "PUBLISHED") notFound();

  // Fetch recommended posts (latest published, excluding the current one)
  const recommendedPosts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });


  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#0a0a0a] selection:bg-indigo-100 selection:text-indigo-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <article className="border-t-4 border-black dark:border-white pt-10">
          <header className="mb-14 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-x-3 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-400 mb-6">
              <time dateTime={post.createdAt.toISOString()}>{format(new Date(post.createdAt), "MMM d, yyyy")}</time>
              <span>•</span>
              <span>{post.authorName || "Editor"}</span>
              <span>•</span>
              <span>{post.viewCount} views</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">{post.title}</h1>
            {post.coverImage && <div className="mt-10 rounded-2xl overflow-hidden shadow-xl aspect-video w-full bg-gray-100 dark:bg-gray-800"><img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" /></div>}
          </header>

          <div className="prose prose-lg sm:prose-xl lg:prose-2xl mx-auto dark:prose-invert prose-headings:font-serif prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-900 dark:prose-p:text-gray-300 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-900 dark:prose-ul:text-gray-300 prose-ol:text-gray-900 dark:prose-ol:text-gray-300 prose-li:text-gray-900 dark:prose-li:text-gray-300 prose-blockquote:text-gray-900 dark:prose-blockquote:text-gray-300 text-gray-900 dark:text-gray-300 editorial-dropcap" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Recommended Posts */}
        {recommendedPosts.length > 0 && (
          <section className="mt-20 pt-10 border-t-4 border-black dark:border-white">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">Recommended Posts</h2>
            <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 scrollbar-hide">
              {recommendedPosts.map((rec, index) => {
                const showImage = index % 2 === 0;
                return (
                  <article
                    key={rec.id}
                    className="relative group flex-shrink-0 w-80 sm:w-96 flex flex-col snap-start border-t border-black dark:border-white pt-5"
                  >
                    {showImage && rec.coverImage && (
                      <div className="w-full h-48 flex-shrink-0 mb-4 rounded-xl overflow-hidden">
                        <img src={rec.coverImage} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-400 mb-2">
                        <time dateTime={rec.createdAt.toISOString()}>
                          {format(new Date(rec.createdAt), "MMM d, yyyy")}
                        </time>
                        <span>•</span>
                        <span>{rec.authorName || "Editor"}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold leading-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-4 line-clamp-3">
                        <Link href={`/post/${rec.slug}`}>
                          <span className="absolute inset-0" />
                          {rec.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

      </main>
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-900 dark:text-gray-400"><p>© {new Date().getFullYear()} neoblog. All rights reserved.</p></div>
      </footer>
    </div>
  );
}

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug: slug } });
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.seoKeywords ? `Read about ${post.seoKeywords}` : post.title, openGraph: { images: post.coverImage ? [post.coverImage] : [] } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Find and update the view count in one operation
  const post = await prisma.post.update({
    where: { slug: slug },
    data: { viewCount: { increment: 1 } }
  }).catch(() => null);

  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white z-10 relative flex items-center gap-2">
            <div className="w-6 h-6 bg-black dark:bg-white rounded-sm flex items-center justify-center">
              <span className="text-white dark:text-black text-xs font-bold">n</span>
            </div>
            neoblog
          </Link>
          <div className="z-10 relative">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <article>
          <header className="mb-14 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-x-4 text-sm text-gray-900 dark:text-gray-400 mb-6"><time dateTime={post.createdAt.toISOString()}>{format(new Date(post.createdAt), "MMMM d, yyyy")}</time><span>•</span><span>{post.authorName || "Editor"}</span><span>•</span><span>{post.viewCount} views</span></div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">{post.title}</h1>
            {post.coverImage && <div className="mt-10 rounded-2xl overflow-hidden shadow-xl aspect-video w-full bg-gray-100 dark:bg-gray-800"><img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" /></div>}
          </header>
          <div className="prose prose-lg sm:prose-xl lg:prose-2xl mx-auto dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-900 dark:prose-p:text-gray-300 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-900 dark:prose-ul:text-gray-300 prose-ol:text-gray-900 dark:prose-ol:text-gray-300 prose-li:text-gray-900 dark:prose-li:text-gray-300 prose-blockquote:text-gray-900 dark:prose-blockquote:text-gray-300 text-gray-900 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-900 dark:text-gray-400"><p>© {new Date().getFullYear()} neoblog. All rights reserved.</p></div>
      </footer>
    </div>
  );
}

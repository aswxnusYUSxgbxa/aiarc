import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug: slug } });
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.seoKeywords ? `Read about ${post.seoKeywords}` : post.title, openGraph: { images: post.coverImage ? [post.coverImage] : [] } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug: slug } });
  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <header className="border-b border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center"><Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:text-indigo-600 transition-colors">CrispyBlog</Link></div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <article>
          <header className="mb-14 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-x-4 text-sm text-gray-500 mb-6"><time dateTime={post.createdAt.toISOString()}>{format(new Date(post.createdAt), "MMMM d, yyyy")}</time><span>•</span><span>{post.authorName || "Editor"}</span></div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">{post.title}</h1>
            {post.coverImage && <div className="mt-10 rounded-2xl overflow-hidden shadow-xl aspect-video w-full bg-gray-100"><img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" /></div>}
          </header>
          <div className="prose prose-lg sm:prose-xl lg:prose-2xl mx-auto prose-indigo prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-500" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
      <footer className="border-t border-gray-100 py-12 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500"><p>© {new Date().getFullYear()} CrispyBlog. All rights reserved.</p></div>
      </footer>
    </div>
  );
}
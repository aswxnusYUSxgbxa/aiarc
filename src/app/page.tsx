import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function HomePage() {
  const posts = await prisma.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-gray-900">CrispyBlog</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-4">Insights & Perspectives</h1>
          <p className="text-xl text-gray-500 max-w-2xl">Read our latest articles, insights, and humanized thoughts generated and refined for perfection.</p>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">No published posts yet.</div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col items-start justify-between bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {post.coverImage && <Link href={`/post/${post.slug}`} className="w-full"><img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" /></Link>}
                <div className="p-6 flex-1 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center gap-x-4 text-xs"><time dateTime={post.createdAt.toISOString()} className="text-gray-500">{format(new Date(post.createdAt), "MMMM d, yyyy")}</time></div>
                    <div className="group relative mt-3"><h3 className="text-xl font-bold leading-6 text-gray-900 group-hover:text-indigo-600 line-clamp-2"><Link href={`/post/${post.slug}`}><span className="absolute inset-0" />{post.title}</Link></h3></div>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">{(post.authorName || "E")[0].toUpperCase()}</div>
                    <div className="text-sm leading-6"><p className="font-semibold text-gray-900">{post.authorName || "Editor"}</p><p className="text-gray-500">Author</p></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
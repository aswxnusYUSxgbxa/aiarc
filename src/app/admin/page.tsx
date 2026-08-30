import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminDashboard() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <Link href="/admin/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Generate New Post</Link>
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                  <div className="text-sm text-gray-500">{post.slug}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${post.status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{post.status}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{format(new Date(post.createdAt), "MMM d, yyyy")}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"><Link href={`/admin/posts/${post.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link></td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No posts yet. Generate one!</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
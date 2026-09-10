import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, LogOut, PenTool, Edit3 } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="flex h-16 items-center px-6">
          <span className="text-xl font-bold text-gray-900 flex items-center gap-2"><LayoutDashboard className="w-5 h-5" /> Admin Panel</span>
        </div>
        <nav className="mt-6 flex flex-col px-4 gap-2">
          <Link href="/admin" className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-gray-900"><FileText className="w-5 h-5" /> All Posts</Link>
          <Link href="/admin/new" className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-gray-900"><PenTool className="w-5 h-5" /> Auto AI Post</Link>
          <Link href="/admin/manual" className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-gray-900"><Edit3 className="w-5 h-5" /> Create Manual Post</Link>
        </nav>
        <div className="absolute bottom-0 w-64 border-t p-4">
          <div className="mb-4 text-sm text-gray-900 truncate px-2">{session.user.email}</div>
          <form action={async () => { "use server"; await signOut(); }}>
            <button type="submit" className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-red-600 hover:bg-red-50"><LogOut className="w-5 h-5" /> Sign out</button>
          </form>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  );
}
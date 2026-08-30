"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

export default function EditPostClient({ post }: { post: any }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [status, setStatus] = useState(post.status);
  const [coverImage, setCoverImage] = useState(post.coverImage || "");
  const [authorName, setAuthorName] = useState(post.authorName || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, status, coverImage, authorName }),
      });
      if (response.ok) {
        alert("Post saved successfully!");
        router.refresh();
      } else alert("Failed to save post");
    } catch (error) { console.error(error); alert("Error saving post"); } finally { setIsSaving(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">{isSaving ? "Saving..." : "Save Post"}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><RichTextEditor content={content} onChange={setContent} /></div>
        </div>
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-md p-2"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label><input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label><input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className="w-full border border-gray-300 rounded-md p-2" />{coverImage && <img src={coverImage} alt="Cover" className="mt-4 rounded-md w-full h-auto" />}</div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords (Read-only)</label><div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">{post.seoKeywords || "None"}</div></div>
        </div>
      </div>
    </div>
  );
}
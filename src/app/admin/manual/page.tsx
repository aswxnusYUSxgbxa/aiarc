"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

export default function CreateManualPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [coverImage, setCoverImage] = useState("");
  const [authorName, setAuthorName] = useState("Editor");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCoverImage(data.url);
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          status,
          coverImage,
          authorName,
        }),
      });

      if (response.ok) {
        alert("Post created successfully!");
        router.push("/admin");
        router.refresh();
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Manual Post</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
        >
          {isSaving ? "Publishing..." : "Publish Post"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your awesome blog title..."
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Content
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Author Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {isUploading && <p className="text-sm text-gray-900 mt-2">Uploading...</p>}
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover Preview"
                className="mt-4 rounded-md w-full h-auto"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

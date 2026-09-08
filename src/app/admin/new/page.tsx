"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !keywords) return;
    setIsGenerating(true);
    setProgress("Initializing AI Pipeline...");
    try {
      setProgress("Fetching SERP Competitors & Keywords...");
      const response = await fetch("/api/generate-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, keywords }) });
      if (!response.ok) throw new Error("Failed to generate post");
      const post = await response.json();
      setProgress("Done! Redirecting to Editor...");
      router.push(`/admin/posts/${post.id}`);
    } catch (error) { console.error(error); alert("Error generating post. Check console."); setProgress(""); } finally { setIsGenerating(false); }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Generate AI Blog Post</h1>
      <p className="text-gray-900 mb-8">Enter a topic and target keywords. The AI will automatically research competitors, create an outline, write a 6000-word humanized article, optimize it for SEO, and save it as a Draft.</p>
      <form onSubmit={handleGenerate} className="space-y-6">
        <div><label className="block text-sm font-medium text-gray-900 mb-1">Topic / Main Idea</label><input type="text" required value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. The Future of Artificial Intelligence in Healthcare" className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500" /></div>
        <div><label className="block text-sm font-medium text-gray-900 mb-1">Target Keywords (comma separated)</label><input type="text" required value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. AI in medicine, future of healthcare, medical artificial intelligence" className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500" /></div>
        <button type="submit" disabled={isGenerating} className="w-full bg-indigo-600 text-white font-medium px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center">{isGenerating ? <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{progress}</span> : "Generate Post Magic ✨"}</button>
      </form>
    </div>
  );
}
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Link as LinkIcon, Unlink } from "lucide-react";
import { useCallback } from "react";

const MenuBar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 p-2 mb-4 bg-gray-50 rounded-t-lg">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}><Bold className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}><Italic className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}><Heading2 className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}><List className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}><ListOrdered className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}><Quote className="w-4 h-4" /></button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button onClick={setLink} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200" : ""}`}><LinkIcon className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30`}><Unlink className="w-4 h-4" /></button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: { content: string; onChange: (content: string) => void; }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-indigo-600 underline' } }),
      Placeholder.configure({ placeholder: "Start writing your amazing post..." })
    ],
    content: content,
    editorProps: { attributes: { class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4 prose-gray prose-headings:text-gray-900 prose-p:text-gray-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900 prose-blockquote:text-gray-900" } },
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
  });
  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

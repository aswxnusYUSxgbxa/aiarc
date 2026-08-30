import prisma from "@/lib/prisma";
import EditPostClient from "./EditPostClient";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id: id } });
  if (!post) notFound();
  return <EditPostClient post={post} />;
}
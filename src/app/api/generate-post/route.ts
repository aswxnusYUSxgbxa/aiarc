import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { slug } from "github-slugger";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { topic, keywords } = await req.json();
    if (!topic || !keywords) return NextResponse.json({ error: "Topic and keywords required" }, { status: 400 });

    if (!process.env.GEMINI_API_KEY) {
      const mockPost = await prisma.post.create({
        data: {
          title: `[MOCK AI] ${topic}`,
          slug: slug(`[MOCK AI] ${topic}` + "-" + Date.now()),
          content: `<h1>Introduction to ${topic}</h1><p>This is a mock generation since GEMINI_API_KEY is not provided in the environment.</p><h2>Keywords analyzed</h2><p>${keywords}</p>`,
          status: "DRAFT",
          seoKeywords: keywords,
        },
      });
      return NextResponse.json(mockPost);
    }

    const outlinePrompt = `You are an expert SEO Strategist. The user wants to write a 6000-word blog post about "${topic}" targeting the following keywords: "${keywords}".\nFirst, analyze what top-ranking competitors usually cover for this topic. \nThen, create a comprehensive, highly detailed outline for a 6000-word article. The outline should include H2s and H3s. Respond ONLY with the outline.`;
    const outlineResponse = await ai.models.generateContent({ model: model, contents: outlinePrompt });
    const outline = outlineResponse.text;

    const writePrompt = `You are a world-class, highly engaging human blog writer. You write conversationally, avoiding robotic or AI-sounding words like "delve", "testament", "tapestry", "embark", etc.\nWrite a comprehensive, ~6000-word blog post based on this outline:\n${outline}\nTopic: ${topic}\nKeywords to naturally include: ${keywords}\nWrite the ENTIRE article in properly formatted semantic HTML (use <h1> for the main title, <h2>, <h3>, <p>, <ul>, <li>, <strong>, etc.). Do not include markdown code block backticks (like \`\`\`html) around the response, just return the raw HTML.\nMake sure the tone is "smooth and crispy", easy to read, humanized, and highly SEO optimized.`;
    const writeResponse = await ai.models.generateContent({ model: model, contents: writePrompt });
    let htmlContent = writeResponse.text || "";
    htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '').trim();

    const titlePrompt = `Based on the following HTML blog post, extract the absolute best, most clickable, SEO-optimized title (H1). Return ONLY the title text, nothing else, no quotes.\n\n${htmlContent.substring(0, 1000)}`;
    const titleResponse = await ai.models.generateContent({ model: model, contents: titlePrompt });
    const generatedTitle = titleResponse.text?.trim() || topic;
    const finalSlug = slug(generatedTitle + "-" + Math.floor(Math.random() * 1000));

    const post = await prisma.post.create({
      data: { title: generatedTitle, slug: finalSlug, content: htmlContent, status: "DRAFT", seoKeywords: keywords },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Pipeline Error:", error);
    return NextResponse.json({ error: "Failed to run AI pipeline" }, { status: 500 });
  }
}
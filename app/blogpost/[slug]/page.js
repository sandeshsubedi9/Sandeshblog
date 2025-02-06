import fs from "fs/promises"; // Use fs.promises for async handling
import matter from "gray-matter";
import { notFound } from "next/navigation";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import OnThisPage from "@/components/onthispage";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export const dynamic = "force-dynamic"; // Ensures the page is dynamically generated

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: "c-programming-tutorial" } },
      { params: { slug: "chatgpt-vs-gemini" } },
      { params: { slug: "cpp-programming-tutorial" } },
      { params: { slug: "css-tutorial" } },
    ],
    fallback: false, // Change to "blocking" if you want dynamic generation
  };
}

export default async function Page({ params }) {
  const filepath = `content/${params.slug}.md`;

  try {
    const fileContent = await fs.readFile(filepath, "utf-8"); // Use async file reading
    const { content, data } = matter(fileContent);

    const processor = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeDocument, { title: data.title || "Blog Post" })
      .use(rehypeFormat)
      .use(rehypeStringify)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .use(rehypePrettyCode, {
        theme: "github-dark",
        transformers: [
          transformerCopyButton({
            visibility: "always",
            feedbackDuration: 3_000,
          }),
        ],
      });

    const htmlContent = (await processor.process(content)).toString();

    return (
      <div className="max-w-6xl mx-auto p-4 px-7">
        <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
        <p className="text-base mb-2 border-l-4 border-gray-500 pl-4 italic">
          &quot;{data.description}&quot;
        </p>
        <div className="flex gap-2">
          <p className="text-sm text-gray-500 mb-4 italic">By {data.author}</p>
          <p className="text-sm text-gray-500 mb-4">{data.date}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert"></div>
        <OnThisPage htmlContent={htmlContent} />
      </div>
    );
  } catch (error) {
    console.error("Error reading file:", error);
    notFound(); // Show 404 page if file is missing
  }
}

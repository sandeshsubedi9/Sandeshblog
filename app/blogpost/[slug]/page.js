import fs from "fs";
import path from "path";
import matter from "gray-matter";
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
import { notFound } from "next/navigation";

// ✅ Define static paths
export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: "c-programming-tutorial" } },
      { params: { slug: "chatgpt-vs-gemini" } },
      { params: { slug: "cpp-programming-tutorial" } },
      { params: { slug: "css-tutorial" } },
    ],
    fallback: false, // Ensures only these pages are generated
  };
}

// ✅ Fetch data at build time
export async function getStaticProps({ params }) {
  const filepath = path.join(process.cwd(), "content", `${params.slug}.md`);

  if (!fs.existsSync(filepath)) {
    return { notFound: true };
  }

  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { content, data } = matter(fileContent);

  // ✅ Process Markdown to HTML (runs only on the server)
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
          feedbackDuration: 3000,
        }),
      ],
    });

  const htmlContent = (await processor.process(content)).toString();

  return {
    props: {
      title: data.title || "Untitled",
      description: data.description || "",
      author: data.author || "Unknown",
      date: data.date || "Unknown",
      htmlContent,
    },
  };
}

// ✅ Page Component
export default function Page({ title, description, author, date, htmlContent }) {
  if (!htmlContent) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-4 px-7">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-base mb-2 border-l-4 border-gray-500 pl-4 italic">
        &quot;{description}&quot;
      </p>
      <div className="flex gap-2">
        <p className="text-sm text-gray-500 mb-4 italic">By {author}</p>
        <p className="text-sm text-gray-500 mb-4">{date}</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert"></div>
      <OnThisPage htmlContent={htmlContent} />
    </div>
  );
}

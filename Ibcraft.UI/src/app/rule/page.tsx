import { getPostBySlug, getPostSlugs } from "@/shared/lib/mdpost";
import { remark } from "remark";
import html from "remark-html";
import 'github-markdown-css/github-markdown.css';
import RuleClient from "./RuleClient";


export async function generateStaticParams() {
    const slugs = getPostSlugs();
    return slugs.map((slug) => ({ slug: slug.replace(/\.md$/, "") }));
}

export default async function Rule() {
    const { content, meta } = getPostBySlug("rules");
    const proccesedContent = await remark().use(html).process(content);
    const contentHtml = proccesedContent.toString()

    return (
        <div className="container">
            <RuleClient />
            <article className="markdown-body" style={{ backgroundColor: "#13061e" }} dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
    )
}

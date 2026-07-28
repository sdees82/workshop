import type { Metadata } from "next";
import { notFound } from "next/navigation";
import rawPages from "../../data/pages.json";
import WorkshopShell from "../WorkshopShell";
import { getBreadcrumbs, lessonOrder } from "../workshop-data";

type PageRecord = {
  path: string;
  title: string;
  bodyHtml: string;
};

const pages = rawPages as PageRecord[];
const pageByPath = new Map(pages.map((page) => [page.path, page]));
const remoteBase =
  "https://catalog.us-east-1.prod.workshops.aws/workshops/23f491af-bf9c-4d3c-bfb4-bab78434f598/en-US";
const staticBase =
  "https://static.us-east-1.prod.workshops.aws/public/6de46c41-f234-4858-b1f2-4adf1b1c835a/static/";

const imageReplacements: Record<string, string> = {
  "claude-code-extensions/recap-diagram.png": "/assets/recap-diagram.png",
  "claude-code-foundation/after-plan.png": "/assets/after-plan.png",
  "claude-code-foundation/agent-loop.png": "/assets/agent-loop.png",
  "claude-code-foundation/cc-context-list.png": "/assets/cc-context-list.png",
  "claude-code-foundation/run-subagents.png": "/assets/run-subagents.png",
  "getting-started/new-terminal.png": "/assets/new-terminal.png",
  "getting-started/taskflow-main.png": "/assets/taskflow-main.png",
  "workshop-intro.png": "/assets/workshop-intro.png",
};

function pathFromSlug(slug?: string[]) {
  return slug?.length ? `/${slug.join("/")}` : "/";
}

function localizeHtml(html: string) {
  let localized = html.replaceAll(remoteBase, "");
  for (const [remotePath, localPath] of Object.entries(imageReplacements)) {
    localized = localized.replaceAll(`${staticBase}${remotePath}`, localPath);
  }
  return localized;
}

function adjacentPage(path: string, offset: -1 | 1) {
  const currentIndex = lessonOrder.indexOf(path);
  const targetPath = lessonOrder[currentIndex + offset];
  if (!targetPath) return null;
  const target = pageByPath.get(targetPath);
  return target ? { path: target.path, title: target.title } : null;
}

export function generateStaticParams() {
  return pages.map((page) => ({
    slug: page.path === "/" ? [] : page.path.slice(1).split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pageByPath.get(pathFromSlug(slug));
  return {
    title: page ? `${page.title} - AI-Powered SDLC with Claude Code` : "Workshop Studio",
    description: "AI-Powered SDLC with Claude Code workshop",
  };
}

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  const page = pageByPath.get(path);
  if (!page) notFound();

  return (
    <WorkshopShell
      title={page.title}
      path={page.path}
      html={localizeHtml(page.bodyHtml)}
      breadcrumbs={getBreadcrumbs(page.path, page.title)}
      previous={adjacentPage(page.path, -1)}
      next={adjacentPage(page.path, 1)}
    />
  );
}

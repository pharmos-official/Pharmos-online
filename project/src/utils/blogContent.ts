import type { ContentBlock } from "../types/blogTemplate";

interface ParsedNode {
  tag: string;
  text: string;
  html: string;
  attrs: Record<string, string>;
  children: ParsedNode[];
}

function decodeEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function parseAttrs(attrs: NamedNodeMap | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!attrs) {
    return result;
  }
  for (let index = 0; index < attrs.length; index += 1) {
    const attr = attrs[index];
    result[attr.name] = attr.value;
  }
  return result;
}

function parseNode(element: Element): ParsedNode {
  const children: ParsedNode[] = [];
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      if (text.trim().length > 0) {
        children.push({ tag: "#text", text, html: text, attrs: {}, children: [] });
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(parseNode(child as Element));
    }
  });

  return {
    tag: element.tagName.toLowerCase(),
    text: decodeEntities(element.textContent ?? "").trim(),
    html: element.outerHTML,
    attrs: parseAttrs(element.attributes),
    children,
  };
}

function toHtml(node: ParsedNode): string {
  return node.html;
}

function nodeToBlock(node: ParsedNode): ContentBlock | null {
  const tag = node.tag;

  if (tag === "p") {
    const images = node.children.filter((child) => child.tag === "img");
    if (images.length > 0) {
      // Check if the paragraph is ONLY an image (no meaningful text or other elements)
      const nonImageChildren = node.children.filter(
        (child) => child.tag !== "img" && !(child.tag === "#text" && !child.text.trim()),
      );
      if (nonImageChildren.length === 0) {
        const image = images[0];
        return {
          type: "image",
          src: image.attrs["src"] ?? "",
          alt: image.attrs["alt"] ?? "",
          html: toHtml(image),
        };
      }
      // Paragraph with text and images → keep as paragraph to preserve ALL content
      if (!node.text && !node.children.some((child) => child.tag === "br")) {
        return null;
      }
      return { type: "paragraph", html: toHtml(node), text: node.text };
    }
    if (!node.text && !node.children.some((child) => child.tag === "br")) {
      return null;
    }
    return { type: "paragraph", html: toHtml(node), text: node.text };
  }

  if (tag === "h1" || tag === "h2" || tag === "h3") {
    return {
      type: "heading",
      level: tag === "h1" ? 1 : tag === "h2" ? 2 : 3,
      html: toHtml(node),
      text: node.text,
    };
  }

  if (tag === "img") {
    return {
      type: "image",
      src: node.attrs["src"] ?? "",
      alt: node.attrs["alt"] ?? "",
      html: toHtml(node),
    };
  }

  if (tag === "blockquote") {
    return { type: "blockquote", html: toHtml(node), text: node.text };
  }

  if (tag === "pre") {
    return { type: "code", html: toHtml(node), text: node.text };
  }

  if (tag === "ul" || tag === "ol") {
    const items = node.children
      .filter((child) => child.tag === "li")
      .map((child) => child.text);
    return { type: "list", ordered: tag === "ol", html: toHtml(node), items };
  }

  if (tag === "iframe" || tag === "video" || tag === "audio") {
    return { type: "video", html: toHtml(node) };
  }

  if (tag === "table") {
    return { type: "html", html: toHtml(node) };
  }

  return null;
}

export function parseBlogContent(html: string): ContentBlock[] {
  if (!html || !html.trim()) {
    return [];
  }

  const template = document.createElement("template");
  template.innerHTML = html;

  const blocks: ContentBlock[] = [];

  template.content.childNodes.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const node = parseNode(child as Element);
      const block = nodeToBlock(node);
      if (block) {
        blocks.push(block);
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = (child.textContent ?? "").trim();
      if (text) {
        blocks.push({ type: "paragraph", html: text, text });
      }
    }
  });

  return blocks;
}

export function extractFirstImage(html: string): string | null {
  const template = document.createElement("template");
  template.innerHTML = html;
  const image = template.content.querySelector("img");
  return image?.getAttribute("src") ?? null;
}

export function stripHtml(html: string): string {
  const template = document.createElement("template");
  template.innerHTML = html;
  return decodeEntities(template.content.textContent ?? "").replace(/\s+/g, " ").trim();
}

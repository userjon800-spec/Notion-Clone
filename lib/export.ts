import { Doc } from "@/convex/_generated/dataModel";

export function exportToMarkdown(doc: Doc<"documents">) {
  let md = `# ${doc.title || "Untitled"}\n\n`;

  if (doc.coverImage) {
    md += `![Cover Image](${doc.coverImage})\n\n`;
  }

  if (doc.content) {
    try {
      const blocks = JSON.parse(doc.content);
      md += parseBlocksToMarkdown(blocks);
    } catch {
      md += doc.content + "\n\n";
    }
  }

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `${(doc.title || "document").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBlocksToMarkdown(blocks: any[], indent = ""): string {
  if (!Array.isArray(blocks)) return "";
  let result = "";

  for (const block of blocks) {
    const text = getBlockText(block.content);
    switch (block.type) {
      case "heading": {
        const level = block.props?.level || 1;
        result += `${"#".repeat(level)} ${text}\n\n`;
        break;
      }
      case "bulletListItem": {
        result += `${indent}- ${text}\n`;
        break;
      }
      case "numberedListItem": {
        result += `${indent}1. ${text}\n`;
        break;
      }
      case "checkListItem": {
        const checked = block.props?.checked ? "[x]" : "[ ]";
        result += `${indent}- ${checked} ${text}\n`;
        break;
      }
      case "codeBlock": {
        const lang = block.props?.language || "";
        result += `\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
        break;
      }
      case "image": {
        const url = block.props?.url || "";
        const caption = block.props?.caption || "image";
        result += `![${caption}](${url})\n\n`;
        break;
      }
      default: {
        if (text) {
          result += `${indent}${text}\n\n`;
        }
        break;
      }
    }

    if (block.children && block.children.length > 0) {
      result += parseBlocksToMarkdown(block.children, indent + "  ");
    }
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getBlockText(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        let t = item.text || "";
        if (item.styles?.bold) t = `**${t}**`;
        if (item.styles?.italic) t = `*${t}*`;
        if (item.styles?.strike) t = `~~${t}~~`;
        if (item.styles?.code) t = `\`${t}\``;
        if (item.href) t = `[${t}](${item.href})`;
        return t;
      })
      .join("");
  }
  return "";
}

export function exportToPDF(documentTitle: string) {
  const originalTitle = window.document.title;
  const html = window.document.documentElement;
  const wasDark = html.classList.contains("dark");

  if (wasDark) {
    html.classList.remove("dark");
  }

  window.document.title = documentTitle || "Document";

  let restored = false;
  const restoreTheme = () => {
    if (restored) return;
    restored = true;
    window.document.title = originalTitle;
    if (wasDark) {
      html.classList.add("dark");
    }
  };

  window.addEventListener("afterprint", restoreTheme, { once: true });

  setTimeout(() => {
    window.print();
    setTimeout(restoreTheme, 500);
  }, 150);
}

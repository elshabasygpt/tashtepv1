"use client";

interface Props {
  content: string;
}

function parseLine(line: string): React.ReactNode {
  // bold: **text**
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return line;
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

export function MarkdownRenderer({ content }: Props) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={key++} className="list-disc list-inside space-y-1.5 mb-4 text-secondary leading-relaxed pr-2">
        {listBuffer.map((item, j) => <li key={j}>{parseLine(item)}</li>)}
      </ul>
    );
    listBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-2xl font-headline-md text-obsidian mt-10 mb-4 border-b border-stone pb-2">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-xl font-headline-md text-obsidian mt-7 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={key++} className="mb-4 text-secondary leading-relaxed text-[17px]">
          {parseLine(line)}
        </p>
      );
    }
  }

  flushList();
  return <div className="article-content">{elements}</div>;
}

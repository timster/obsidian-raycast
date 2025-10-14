import { dirname, join, relative } from "path";
import { readdirSync, readFileSync } from "fs";

import { getPreferenceValues } from "@raycast/api";

export function makeSafeNoteName(title: string): string {
  return encodeURIComponent(title.trim().replace(/[\\/]/g, "-"));
}

export type Note = {
  key: number;
  path: string;
  directory: string;
  content: string;
  title: string;
};

export type Snippet = Note & {
  language: string;
  markdown: string;
};

export type Task = {
  title: string;
  date: string | null;
  line: string;
  lineNumber: number;
  done: boolean;
};

export function getAllNotes(rootPath: string): Note[] {
  const result: Note[] = [];
  let keyCounter = 0;

  function walk(currentPath: string) {
    for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
      const entryPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (entry.name.endsWith(".md")) {
        try {
          const content = readFileSync(entryPath, "utf-8");
          const title = entry.name.replace(/\.md$/, "").trim();

          result.push({
            key: keyCounter++,
            path: relative(rootPath, entryPath).replace(/\.md$/, ""),
            directory: relative(rootPath, dirname(entryPath)),
            title,
            content: `# ${title}\n\n${content}`,
          });
        } catch (err) {
          console.error(`Error reading ${entryPath}:`, err);
        }
      }
    }
  }

  walk(rootPath);
  return result;
}

export function useNotes(): Note[] {
  const { obsidianDirectory } = getPreferenceValues<Preferences>();
  return getAllNotes(obsidianDirectory);
}
export function useSnippets(): Snippet[] {
  const { obsidianDirectory } = getPreferenceValues<Preferences>();
  const root = join(obsidianDirectory, "snippets");
  const notes = getAllNotes(root);

  const snippets: Snippet[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

  let keyCounter = 1;

  for (const note of notes) {
    for (const match of note.content.matchAll(codeBlockRegex)) {
      const [, langRaw = "", code = ""] = match;
      const language = langRaw.trim() || "text";
      const content = code.trim();

      snippets.push({
        key: keyCounter++,
        path: note.path,
        directory: note.directory,
        title: note.title,
        content,
        markdown: `# ${note.title}\n\n\`\`\`${language}\n${content}\n\`\`\``,
        language,
      });
    }
  }

  return snippets;
}
export function useTasks(): Task[] {
  const { obsidianDirectory } = getPreferenceValues<Preferences>();
  const lines = readFileSync(join(obsidianDirectory, "general", "Current Tasks.md"), "utf8").split("\n");

  return lines
    .map((line, index): Task | null => {
      const match = line.match(/^- \[( |x)\] (.+)/);
      if (!match) return null;

      const dateMatch = match[2].match(/^\[(\d{4}-\d{2}-\d{2})\] (.+)/);
      const title = dateMatch ? dateMatch[2] : match[2];
      const date = dateMatch ? dateMatch[1] : null;

      return {
        title,
        date,
        line,
        lineNumber: index,
        done: match[1] === "x",
      };
    })
    .filter((task): task is Task => Boolean(task && !task.done));
}

import { dirname, join, relative } from "path";
import { readdir, readFile } from "fs/promises";

import { getPreferenceValues } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

export function makeSafeNoteName(title: string): string {
  return title.trim().replace(/[\\/]/g, "-");
}

export type Note = {
  key: number;
  path: string;
  directory: string;
  content: string;
  title: string;
  markdown: string;
};

export type Snippet = Note & {
  language: string;
};

export type Task = {
  key: number;
  title: string;
  line: number;
};

const ignoredDirectories = ["tasks", ".git", ".obsidian", "assets"];

export async function getAllNotes(rootPath: string = ""): Promise<Note[]> {
  const { obsidianDirectory } = getPreferenceValues<Preferences>();

  const result: Note[] = [];
  let keyCounter = 0;

  async function walk(currentPath: string) {
    const entries = await readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (ignoredDirectories.includes(entry.name)) {
          continue;
        }
        await walk(entryPath);
      } else if (entry.name.endsWith(".md")) {
        try {
          const content = await readFile(entryPath, "utf-8");
          const title = entry.name.replace(/\.md$/, "").trim();
          const note = {
            key: keyCounter++,
            path: relative(obsidianDirectory, entryPath).replace(/\.md$/, ""),
            directory: dirname(entryPath).split(/[\\/]/).pop() || "",
            title,
            content,
            markdown: `# ${title}\n\n${content}`,
          };

          result.push(note);
        } catch (err) {
          console.error(`Error reading ${entryPath}:`, err);
        }
      }
    }
  }

  await walk(join(obsidianDirectory, rootPath));

  return result;
}

export function useNotes() {
  return useCachedPromise(getAllNotes);
}

async function getSnippets(): Promise<Snippet[]> {
  const notes = await getAllNotes("snippets");

  const snippets: Snippet[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

  let keyCounter = 0;

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

export function useSnippets() {
  return useCachedPromise(getSnippets);
}

async function getTasks(): Promise<Task[]> {
  const { obsidianDirectory } = getPreferenceValues<Preferences>();
  const filePath = join(obsidianDirectory, "Current Tasks.md");

  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");

  const tasks: Task[] = [];
  const incompleteTaskRegex = /^- \[ \] (.+)$/;

  lines.forEach((line, index) => {
    const match = line.match(incompleteTaskRegex);
    if (match) {
      tasks.push({
        key: index,
        title: match[1].trim(),
        line: index,
      });
    }
  });

  return tasks;
}

export function useTasks() {
  return useCachedPromise(getTasks);
}

function searchItemsByTitleAndContent<T extends { title: string; content: string }>(items: T[], query: string): T[] {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(Boolean);

  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const content = item.content.toLowerCase();

      let rank = 0;

      // Exact match in title
      if (title === lowerQuery) rank = 10;
      // Exact match in content
      else if (content.includes(lowerQuery)) rank = 9;
      // All words match in title
      else if (queryWords.every((w) => title.includes(w))) rank = 8;
      // All words match in content
      else if (queryWords.every((w) => content.includes(w))) rank = 7;

      return { item, rank };
    })
    .filter(({ rank }) => rank > 0) // keep only matches
    .sort((a, b) => b.rank - a.rank) // highest rank first
    .map(({ item }) => item);
}

export function searchNotes(notes: Note[], query: string): Note[] {
  return searchItemsByTitleAndContent(notes, query);
}

export function searchSnippets(snippets: Snippet[], query: string): Snippet[] {
  return searchItemsByTitleAndContent(snippets, query);
}

import { dirname, join, relative } from "path";
import { readdirSync, readFileSync } from "fs";

import { getPreferenceValues } from "@raycast/api";

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

export type Task = Note & {
  completed: boolean;
  created: string | null;
  due: string | null;
};

const ignoredDirectories = ["tasks", ".git", ".obsidian", "assets"];

export function getAllNotes(rootPath: string = ""): Note[] {
  const { obsidianDirectory } = getPreferenceValues<Preferences>();

  const result: Note[] = [];
  let keyCounter = 0;

  function walk(currentPath: string) {
    for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
      const entryPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (ignoredDirectories.includes(entry.name)) {
          continue;
        }
        walk(entryPath);
      } else if (entry.name.endsWith(".md")) {
        try {
          const content = readFileSync(entryPath, "utf-8");
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

  walk(join(obsidianDirectory, rootPath));

  return result;
}

export function useNotes(): Note[] {
  return getAllNotes();
}

export function useSnippets(): Snippet[] {
  const notes = getAllNotes("snippets");

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
  const notes = getAllNotes("tasks");

  return notes
    .map((note): Task => {
      const completedMatch = note.content.match(/completed:\s*(true|false)/i);
      const completed = completedMatch ? completedMatch[1].toLowerCase() === "true" : false;

      const createdMatch = note.content.match(/created:\s*(\d{4}-\d{2}-\d{2})/i);
      const created = createdMatch ? createdMatch[1] : null;

      const dueMatch = note.content.match(/due:\s*(\d{4}-\d{2}-\d{2})/i);
      const due = dueMatch ? dueMatch[1] : null;

      return {
        ...note,
        completed,
        created,
        due,
      };
    })

    .sort((a, b) => {
      // Sort by due first: oldest on top (nulls at bottom)
      if (a.due && b.due) {
        if (a.due < b.due) return -1;
        if (a.due > b.due) return 1;
      } else if (a.due && !b.due) {
        return -1;
      } else if (!a.due && b.due) {
        return 1;
      }
      // If due is same or both missing, sort by created: oldest on top (nulls at bottom)
      if (a.created && b.created) {
        if (a.created < b.created) return -1;
        if (a.created > b.created) return 1;
      } else if (a.created && !b.created) {
        return -1;
      } else if (!a.created && b.created) {
        return 1;
      }
      return 0;
    })

    .filter((task): task is Task => Boolean(task && !task.completed));
}

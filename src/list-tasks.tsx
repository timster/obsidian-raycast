import { List, Action, Icon, ActionPanel, open } from "@raycast/api";
import { useTasks } from "./utils";

function parseDueDate(title: string): { cleanTitle: string; dueDate: string | null } {
  const dueDateMatch = title.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
  if (dueDateMatch) {
    const cleanTitle = title.replace(/\s*📅\s*\d{4}-\d{2}-\d{2}/, "").trim();
    return { cleanTitle, dueDate: dueDateMatch[1] };
  }
  return { cleanTitle: title, dueDate: null };
}

export default function listTasksCommand() {
  const { data: tasks = [], isLoading } = useTasks();

  return (
    <List isShowingDetail={false} isLoading={isLoading}>
      {tasks.map((task) => {
        const { cleanTitle, dueDate } = parseDueDate(task.title);
        return (
          <List.Item
            key={task.key}
            title={cleanTitle}
            icon={Icon.Circle}
            accessories={dueDate ? [{ text: dueDate, icon: Icon.Calendar }] : []}
            actions={
              <ActionPanel>
                <Action
                  title="Open Tasks File"
                  onAction={() => void open(`obsidian://open?vault=Obsidian&file=Current Tasks`)}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}

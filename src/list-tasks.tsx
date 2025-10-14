import { List, Action, Icon, ActionPanel, open } from "@raycast/api";
import { useTasks } from "./utils";

export default function searchTasksCommand() {
  const tasks = useTasks();

  return (
    <List isShowingDetail={false}>
      {tasks.map((task) => (
        <List.Item
          key={task.lineNumber}
          title={task.title}
          icon={task.done ? Icon.CheckCircle : Icon.Circle}
          accessories={[{ tag: task.date }]}
          actions={
            <ActionPanel>
              <Action
                title="Open Current Tasks"
                onAction={() => open("obsidian://open?vault=Obsidian&file=general/Current Tasks")}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

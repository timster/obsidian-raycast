import { List, Action, Icon, ActionPanel, open } from "@raycast/api";
import { Task, useTasks } from "./utils";

function completeTask(task: Task) {
  const content = task.content.replace(/completed:\s*(true|false)/i, `completed: true`);
  open(`obsidian://new?vault=Obsidian&file=${task.path}&content=${content}&overwrite=true`);

  console.log(`obsidian://new?vault=Obsidian&file=${task.path}&content=${content}&overwrite=true`);
}

export default function searchTasksCommand() {
  const tasks = useTasks();

  return (
    <List isShowingDetail={false}>
      {tasks.map((task) => (
        <List.Item
          key={task.key}
          title={task.title}
          icon={task.completed ? Icon.CheckCircle : Icon.Circle}
          accessories={[{ tag: task.due }]}
          actions={
            <ActionPanel>
              <Action title="Open Task" onAction={() => open(`obsidian://open?vault=Obsidian&file=${task.path}`)} />
              <Action title="Complete Task" onAction={() => completeTask(task)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

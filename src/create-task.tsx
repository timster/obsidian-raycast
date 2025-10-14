import { closeMainWindow, LaunchProps, open } from "@raycast/api";

export default function createNoteCommand(props: LaunchProps) {
  const title = props.arguments.title.trim() || "Unknown Task";
  const now = new Date().toISOString().split("T")[0];
  const newTask = `- [ ] [${now}] ${title}`;

  open(`obsidian://new?vault=Obsidian&file=general/Current Tasks&content=${newTask}&prepend=true`);

  closeMainWindow();
}

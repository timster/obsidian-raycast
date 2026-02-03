import { closeMainWindow, LaunchProps, open } from "@raycast/api";
import { makeSafeNoteName } from "./utils";

export default function createMeetingNoteCommand(props: LaunchProps) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const title = makeSafeNoteName(`${today} - ${props.arguments.title?.trim() || "Untitled"}`);

  void open(`obsidian://new?vault=Obsidian&file=meetings/${title}`);
  void closeMainWindow();
}

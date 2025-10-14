import { closeMainWindow, LaunchProps, open } from "@raycast/api";
import { makeSafeNoteName } from "./utils";

export default function Command(props: LaunchProps) {
  const title = makeSafeNoteName(props.arguments.title.trim() || "Untitled");

  open(`obsidian://new?vault=Obsidian&file=${title}`);
  closeMainWindow();
}

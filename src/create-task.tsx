import { closeMainWindow, LaunchProps, open } from "@raycast/api";
import { makeSafeNoteName } from "./utils";

export default function createNoteCommand(props: LaunchProps) {
  const title = makeSafeNoteName(props.arguments.title.trim() || "Unknown Task");
  const now = new Date().toISOString().split("T")[0];
  const content = `---\ncreated: ${now}\ndue: \ncompleted: false\n---`;

  open(`obsidian://new?vault=Obsidian&file=tasks/${title}&overwrite=true&content=${content}`);

  closeMainWindow();
}

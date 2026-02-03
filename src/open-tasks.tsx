import { closeMainWindow, open } from "@raycast/api";

export default async function Command() {
  void open("obsidian://open?vault=Obsidian&file=Current%20Tasks.base");
  void closeMainWindow();
}

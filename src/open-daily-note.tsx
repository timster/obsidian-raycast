import { closeMainWindow, open } from "@raycast/api";

export default function Command() {
  void open("obsidian://daily?vault=Obsidian");
  void closeMainWindow();
}

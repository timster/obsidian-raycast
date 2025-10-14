import { closeMainWindow, open } from "@raycast/api";

export default function Command() {
  open("obsidian://daily?vault=Obsidian");
  closeMainWindow();
}

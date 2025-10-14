import { closeMainWindow, open } from "@raycast/api";

export default async function Command() {
  await open("obsidian://open?vault=Obsidian&file=general/Current Tasks");
  closeMainWindow();
}
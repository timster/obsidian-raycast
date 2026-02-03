import { useState, useMemo } from "react";
import { ActionPanel, List, Action, Icon, open } from "@raycast/api";

import { useNotes, searchNotes } from "./utils";

export default function searchNotesCommand() {
  const { data: notes = [], isLoading } = useNotes();

  const [searchText, setSearchText] = useState<string>("");

  const searchResults = useMemo(() => searchNotes(notes, searchText), [notes, searchText]);

  return (
    <List
      filtering={false}
      isShowingDetail={true}
      isLoading={isLoading}
      searchBarPlaceholder="Search for notes..."
      onSearchTextChange={setSearchText}
    >
      {searchResults.map((note) => (
        <List.Item
          key={note.key}
          title={note.title}
          icon="extension-icon.png"
          accessories={[
            { icon: Icon.Folder, tag: note.directory || "root" },
            // { text: result.score !== undefined ? `${result.score.toFixed(2)}` : undefined },
          ]}
          detail={<List.Item.Detail markdown={note.markdown} />}
          actions={
            <ActionPanel>
              <Action title="Open Note" onAction={() => void open(`obsidian://open?vault=Obsidian&file=${note.path}`)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

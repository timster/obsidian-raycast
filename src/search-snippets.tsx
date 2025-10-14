import { useMemo, useState } from "react";
import { ActionPanel, List, Action, Icon, getPreferenceValues, open } from "@raycast/api";
import Fuse from "fuse.js";

import { useSnippets } from "./utils";

export default function searchSnippetsCommand() {
  const { querySearchUrl, splunkSearchUrl } = getPreferenceValues<ExtensionPreferences>();

  const notes = useSnippets();

  const [searchText, setSearchText] = useState<string>("");

  const searchResults = useMemo(() => {
    const fuse = new Fuse(notes, {
      includeScore: true,
      keys: ["title", "content"],
    });
    return fuse.search(searchText);
  }, [notes, searchText]);

  function getSplunkUrl(query: string) {
    return `${splunkSearchUrl}${query}`;
  }

  function getQueryUrl(query: string) {
    return `${querySearchUrl}${encodeURIComponent(query)}`;
  }

  return (
    <List
      isShowingDetail={true}
      searchBarPlaceholder="Search for snippets..."
      isLoading={false}
      onSearchTextChange={setSearchText}
    >
      {searchResults.map((result) => (
        <List.Item
          key={result.item.key}
          title={result.item.title}
          icon="extension-icon.png"
          accessories={[{ icon: Icon.Folder, tag: result.item.directory || "root" }]}
          detail={<List.Item.Detail markdown={result.item.markdown} />}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="Copy Snippet" content={result.item.content} />
              {result.item.language == "sql" && (
                <Action.OpenInBrowser title="Open in Sql Console" url={getQueryUrl(result.item.content)} />
              )}
              {result.item.language !== "sql" && (
                <Action.OpenInBrowser title="Open in Splunk" url={getSplunkUrl(result.item.content)} />
              )}
              <Action
                title="Open Note"
                onAction={() => open(`obsidian://open?vault=Obsidian&file=${result.item.path}`)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

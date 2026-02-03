import { useMemo, useState } from "react";
import { ActionPanel, List, Action, Icon, getPreferenceValues, open } from "@raycast/api";

import { searchSnippets, useSnippets } from "./utils";

export default function searchSnippetsCommand() {
  const { querySearchUrl, splunkSearchUrl } = getPreferenceValues<ExtensionPreferences>();

  const { data: snippets = [], isLoading } = useSnippets();

  const [searchText, setSearchText] = useState<string>("");

  const searchResults = useMemo(() => searchSnippets(snippets, searchText), [snippets, searchText]);

  function getSplunkUrl(query: string) {
    return `${splunkSearchUrl}${query}`;
  }

  function getQueryUrl(query: string) {
    return `${querySearchUrl}${encodeURIComponent(query)}`;
  }

  return (
    <List
      filtering={false}
      isShowingDetail={true}
      searchBarPlaceholder="Search for snippets..."
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
    >
      {searchResults.map((snippet) => (
        <List.Item
          key={snippet.key}
          title={snippet.title}
          icon="extension-icon.png"
          accessories={[{ icon: Icon.Folder, tag: snippet.directory || "root" }]}
          detail={<List.Item.Detail markdown={snippet.markdown} />}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="Copy Snippet" content={snippet.content} />
              {snippet.language == "sql" && (
                <Action.OpenInBrowser title="Open in Sql Console" url={getQueryUrl(snippet.content)} />
              )}
              {snippet.language !== "sql" && (
                <Action.OpenInBrowser title="Open in Splunk" url={getSplunkUrl(snippet.content)} />
              )}
              <Action title="Open Note" onAction={() => void open(`obsidian://open?vault=Obsidian&file=${snippet.path}`)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

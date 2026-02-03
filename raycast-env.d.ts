/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Obsidian Directory - Directory containing Obsidian notes */
  "obsidianDirectory": string,
  /** Splunk Search URL - URL for Splunk search endpoint */
  "splunkSearchUrl": string,
  /** Query Search URL - URL for SQL search endpoint */
  "querySearchUrl": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-notes` command */
  export type SearchNotes = ExtensionPreferences & {}
  /** Preferences accessible in the `list-tasks` command */
  export type ListTasks = ExtensionPreferences & {}
  /** Preferences accessible in the `search-snippets` command */
  export type SearchSnippets = ExtensionPreferences & {}
  /** Preferences accessible in the `open-daily-note` command */
  export type OpenDailyNote = ExtensionPreferences & {}
  /** Preferences accessible in the `open-tasks` command */
  export type OpenTasks = ExtensionPreferences & {}
  /** Preferences accessible in the `create-note` command */
  export type CreateNote = ExtensionPreferences & {}
  /** Preferences accessible in the `create-meeting-note` command */
  export type CreateMeetingNote = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-notes` command */
  export type SearchNotes = {}
  /** Arguments passed to the `list-tasks` command */
  export type ListTasks = {}
  /** Arguments passed to the `search-snippets` command */
  export type SearchSnippets = {}
  /** Arguments passed to the `open-daily-note` command */
  export type OpenDailyNote = {}
  /** Arguments passed to the `open-tasks` command */
  export type OpenTasks = {}
  /** Arguments passed to the `create-note` command */
  export type CreateNote = {
  /** Title */
  "title": string
}
  /** Arguments passed to the `create-meeting-note` command */
  export type CreateMeetingNote = {
  /** Title */
  "title": string
}
}


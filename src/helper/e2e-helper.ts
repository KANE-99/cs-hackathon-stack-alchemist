import { addEditableTags } from "@contentstack/utils";
import Stack from "../sdk/entry";

export const getAiAssistantPageRes = async (
  entryUrl: string,
  locale: string,
) => {
  const ctUid = entryUrl.split("-")[0];
  const response = (await Stack.getEntryByUrl({
    contentTypeUid: ctUid,
    entryUrl: `/e2e/${entryUrl}`,
    referenceFieldPath: [],
    jsonRtePath: [
      "rich_text_editor",
      "json_rte",
      "markdown",
      "group.json_rte",
      "modular_blocks.level1.json_rte",
      "modular_blocks.level1.modular_block_2.level2.json_rte",
    ],
    locale,
  })) as any;
  const entry = response[0];
  addEditableTags(entry, ctUid, true, entry?.locale || locale);
  return entry;
};

export const getEffectiveContentChangesPageRes = async (
  ctUid: string,
  locale: string,
) => {
  const response = (await Stack.getEntryByUrl({
    contentTypeUid: ctUid,
    entryUrl: `/e2e/${ctUid}`,
    referenceFieldPath: [],
    jsonRtePath: [
      "rich_text_editor",
      "json_rte",
      "rich_text_editor_multiple",
      "modular_blocks_nesting.0.level1.group_nesting.rich_text_editor",
    ],
    locale,
  })) as any;
  const entry = response[0];
  addEditableTags(entry, ctUid, true, entry?.locale || locale);
  return entry;
};

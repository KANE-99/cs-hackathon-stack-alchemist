import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SDK, { onEntryChange } from "../sdk/entry";
import { isPlainObject } from "lodash";
import { addEditableTags } from "@contentstack/utils";
import Accordion from "../components/Accordion";

const getEntryByUrl = SDK.getEntryByUrl;

const referenceFieldPath: string[] = [
  "reference",
  "reference_multiple_ct",
  "reference_multiple",
  "reference_multiple_multiple_ct",
];
const jsonRtePath: string[] = ["json_rte", "json_rich_text_editor_multiple"];
const AllFields = () => {
  const { contentTypeUid } = useParams();
  const location = useLocation();
  const entryUrl = location.pathname;

  const [allFieldsEntry, setAllFieldsEntry] = useState<Record<
    string,
    any
  > | null>(null);

  const fetchEntry = useCallback((url: string) => {
    getEntryByUrl({
      entryUrl: url,
      // @ts-expect-error - this will be present
      contentTypeUid: contentTypeUid,
      referenceFieldPath,
      jsonRtePath,
      includeAll: true,
    })
      .then((result) => {
        //@ts-ignore
        const entry = { ...(result?.[0] ?? {}) };
        // @ts-expect-error - this will be present
        addEditableTags(entry, contentTypeUid, true);
        setAllFieldsEntry(entry);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!entryUrl) return;
    fetchEntry(entryUrl);
  }, [entryUrl]);

  useEffect(() => {
    if (!entryUrl) return;
    onEntryChange(() => fetchEntry(entryUrl), { skipInitialRender: true });
  }, []);

  if (!allFieldsEntry) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h1 className="advance-fields-heading">AllFields</h1>

      <FieldsTable entry={allFieldsEntry} />
      <Accordion
        title={allFieldsEntry?.title}
        titleCslp={allFieldsEntry?.$?.title}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis magni
        iste praesentium voluptas, beatae quasi delectus minus facere saepe
        architecto expedita quae nobis. A nesciunt at ex excepturi corporis
        harum?
      </Accordion>
    </>
  );
};
interface IFieldsTable {
  entry: (Record<string, any> | string) & {
    $?: Record<string, { "data-cslp": string }>;
  };
  $?: Record<string, any>;
}
//Create a component called FieldsTable that takes entry as a prop and returns a table with the key-value pairs of the entry object.
const FieldsTable = ({ entry, $ = {} }: IFieldsTable) => {
  if (!isPlainObject(entry)) {
    return (
      <td {...$} data-leaf={true} data-testid={$?.["data-cslp"]}>
        {JSON.stringify(entry)}
      </td>
    );
  }
  return (
    <TableStructureHOC $={$}>
      <>
        {Object.entries(entry).map(([key, value]) => {
          const attributes: Record<string, any> = entry?.$?.[key] || {};
          if (key === "$") {
            return <></>;
          }
          if (isPlainObject(value)) {
            return (
              <tr {...attributes} key={key}>
                <td>{key}</td>
                <td>
                  <FieldsTable entry={value} />
                </td>
              </tr>
            );
          }
          if (Array.isArray(value) && value.length > 0) {
            return (
              <tr {...attributes} key={key}>
                <td>{key}</td>
                <td>
                  {value.map((item, index) => {
                    const indexAttribute = entry?.$?.[`${key}__${index}`] || {};
                    return (
                      <FieldsTable
                        entry={item}
                        key={index}
                        $={indexAttribute}
                      />
                    );
                  })}
                </td>
              </tr>
            );
          }
          return (
            <tr key={key}>
              <td>{key}</td>
              <td {...attributes} data-testid={attributes?.["data-cslp"]}>
                {value}
              </td>
            </tr>
          );
        })}
      </>
    </TableStructureHOC>
  );
};
const TableStructureHOC = ({
  children,
  $,
}: {
  children: React.ReactNode;
  $: Record<string, any>;
}) => {
  return (
    <table {...$}>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};
export default AllFields;

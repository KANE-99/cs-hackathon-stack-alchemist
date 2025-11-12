/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
import * as contentstack from "contentstack";
import * as Utils from "@contentstack/utils";
import config from "../config";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

type GetEntry = {
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
  locale?: string | null;
};

type GetEntryByUrl = {
  entryUrl: string | undefined;
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
  locale?: string | null;
  includeAll?: boolean;
};

const previewApiUrl = ((config.API_HOST as string) || "")
  .replace("cdn", "rest-preview")
  .replace(".io", ".com");

export const Stack = contentstack.Stack({
  api_key: `${config.API_KEY}`,
  delivery_token: `${config.DELIVERY_TOKEN}`,
  environment: `${config.ENVIRONMENT}`,
  branch: "main",
  live_preview: {
    preview_token: `${config.PREVIEW_TOKEN}` ? `${config.PREVIEW_TOKEN}` : "",
    enable: true,
    host: `${previewApiUrl}` ? `${previewApiUrl}` : "",
  },
});

/**
 * initialize live preview
 */

const appURL = new URL(config.APP_HOST);

ContentstackLivePreview.init({
  enable: true,
  mode: "builder",
  //@ts-ignore
  stackSdk: Stack,
  clientUrlParams: {
    host: appURL.hostname,
    port: appURL.port,
    protocol: appURL.protocol.split(":")[0] as "http" | "https",
  },
  stackDetails: {
    apiKey: config.API_KEY,
  },
  ssr: false,
});

if (config.API_HOST) {
  Stack.setHost(config.API_HOST);
}

const renderOption = {
  span: (node: any, next: any) => {
    return next(node.children);
  },
};

export const onEntryChange = ContentstackLivePreview.onEntryChange;

export default {
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({
    contentTypeUid,
    referenceFieldPath,
    jsonRtePath,
    locale,
  }: GetEntry) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      if (locale) query.language(locale);
      query
        // .includeOwner()
        //.includeContentType()
        .includeFallback()
        .toJSON()
        .find()
        .then(
          (result) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            reject(error);
          },
        );
    });
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({
    contentTypeUid,
    entryUrl,
    referenceFieldPath,
    jsonRtePath,
    locale,
    includeAll = false,
  }: GetEntryByUrl) {
    return new Promise((resolve, reject) => {
      const blogQuery = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
      if (locale) blogQuery.language(locale);
      if (includeAll) {
        blogQuery.addQuery("include_all", "true");
        blogQuery.addQuery("include_all_depth", "2");
      }
      blogQuery
        .addQuery("include_applied_variants", "true")
        .includeFallback()
        .toJSON();
      const data = blogQuery.where("url", `${entryUrl}`).find();
      data.then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0]);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
};

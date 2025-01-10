export type {
  PageObjectResponse,
  RichTextItemResponse,
  MultiSelectPropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type PostProps = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  category: {
    id: string;
    name: string;
    color: string;
  }[];
  publishedAt?: string;
  updatedAt?: string;
};

export type Cover =
  | {
      type: "external";
      external: {
        url: string;
      };
    }
  | null
  | {
      type: "file";
      file: {
        url: string;
        expiry_time: string;
      };
    }
  | null;

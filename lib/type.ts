export type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type PostProps = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
    color: string;
  }[];
  publishedAt?: string;
  updatedAt?: string;
};

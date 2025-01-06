import { notion } from "./notion";
import { PageObjectResponse, PostProps, RichTextItemResponse } from "./type";

export const getDatabase = async (): Promise<PostProps[]> => {
  const response = await notion.databases.query({
    database_id: process.env.DATABASE_ID as string,
    filter: {
      property: "Status",
      status: {
        equals: "Published",
      },
    },
    sorts: [
      {
        property: "Published_at",
        direction: "ascending",
      },
    ],
  });
  return response.results.map((page) =>
    mapNotionPageToPost(page as PageObjectResponse)
  );
};

const mapNotionPageToPost = (page: PageObjectResponse): PostProps => {
  return {
    id: page.id,
    slug: getPlainText(
      (page.properties.Slug as { rich_text: RichTextItemResponse[] }).rich_text
    ),
    title: getPlainText(
      (page.properties.Title as { title: RichTextItemResponse[] }).title
    ),
    description: getPlainText(
      (page.properties.Description as { rich_text: RichTextItemResponse[] })
        .rich_text
    ),
    category: (
      page.properties.Category as {
        multi_select: {
          id: string;
          name: string;
          color: string;
        }[];
      }
    ).multi_select.map((item) => {
      return {
        id: item.id,
        name: item.name,
        color: item.color,
      };
    }),
    publishedAt: (
      page.properties.Published_at as { date: { start: string } | null }
    ).date?.start,
    updatedAt: (
      page.properties.Updated_at as { date: { start: string } | null }
    ).date?.start,
  };
};

const getPlainText = (richText: RichTextItemResponse[]) => {
  return richText.map((item) => item.plain_text).join("");
};

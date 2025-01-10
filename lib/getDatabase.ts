import { notion } from "./notion";
import {
  PageObjectResponse,
  PostProps,
  Cover,
  RichTextItemResponse,
  MultiSelectPropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
} from "./type";

// PageObjectResponse[] -> PostProps[]
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

  return Promise.all(
    response.results.map((page) =>
      mapNotionPageToPost(page as PageObjectResponse)
    )
  );
};

const mapNotionPageToPost = async (
  page: PageObjectResponse
): Promise<PostProps> => {
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
    cover: page.cover
      ? page.cover.type === "file"
        ? await uploadImage(page.cover.file.url)
        : page.cover.external.url
      : "",
    category: (
      page.properties.Category as MultiSelectPropertyItemObjectResponse
    ).multi_select.map((item) => ({
      id: item.id,
      name: item.name,
      color: item.color,
    })),
    publishedAt: (
      page.properties.Published_at as DatePropertyItemObjectResponse
    ).date?.start,
    updatedAt: (page.properties.Updated_at as DatePropertyItemObjectResponse)
      .date?.start,
  };
};

const getPlainText = (richText: RichTextItemResponse[]) => {
  return richText.map((item) => item.plain_text).join("");
};

const uploadImage = async (imageUrl: string) => {
  // use the last segment of the url as the filename, remove the query parameters
  const filename = imageUrl.split("/").pop()?.split("?")[0] || "";

  // if there is no filename, return the original url
  if (!filename) return imageUrl;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // get the image content
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) return imageUrl;

    const imageBlob = await imageResponse.blob();

    // upload to Vercel Blob
    const response = await fetch(`${baseUrl}/api/upload?filename=${filename}`, {
      method: "POST",
      body: imageBlob,
    });

    const result = await response.json();
    return result.url;
  } catch (error) {
    // if there is an error, return the original url
    console.error("Error uploading image:", error);
    return imageUrl;
  }
};

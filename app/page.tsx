import { getDatabase } from "@/lib/getDatabase";

export default async function Home() {
  const database = await getDatabase();
  return <pre>{JSON.stringify(database, null, 2)}</pre>;
}

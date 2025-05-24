import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import Vote from "./_components/vote";
import type { SearchParams } from "next/dist/server/request/search-params";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);
  const { mode } = await searchParams;

  return (
    <div className="bg-muted flex items-center justify-center p-4">
      <Vote
        session={session}
        mode={typeof mode === "string" ? mode : undefined}
      />
    </div>
  );
}

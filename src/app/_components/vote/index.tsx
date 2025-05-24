"use client";

import React, { useEffect, useState } from "react";
import { checkVoted } from "@/lib/actions";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import VoteForm from "./VoteForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DZ_Vote } from "@/db/types";

export default function Vote({
  session,
  mode,
}: {
  session: Session | null;
  mode?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [voteData, setVoteData] = useState<DZ_Vote | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!session?.user?.id) {
        router.replace("/login");
        return;
      }

      const userId = session.user.id;
      const isUpdateMode = mode === "update";

      const data = await checkVoted(userId);

      if (!isUpdateMode && data) {
        router.replace("/results");
        return;
      }

      if (data) {
        setVoteData(data);
      }
      setIsLoading(false);
    };

    setIsLoading(true);
    run();
  }, [session, mode, router]);

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-10">로딩 중...</div>
    );
  }

  return (
    <Card className="w-full max-w-2xl min-h-96">
      <CardHeader className="text-center text-2xl font-bold">
        여론 조사 참여
      </CardHeader>
      <CardContent>
        {voteData ? (
          <VoteForm userId={session!.user!.id} initData={voteData} />
        ) : (
          <div className="w-full flex items-center justify-center min-h-40">
            <p className="text-center text-muted-foreground text-sm bg-muted px-4 py-2 rounded-md border border-border">
              데이터를 불러오지 못했습니다. <br className="hidden sm:block" />
              새로 고침해주세요.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

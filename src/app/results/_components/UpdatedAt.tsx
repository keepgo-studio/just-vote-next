import { readUpdateDate } from "@/lib/actions";
import { format } from "date-fns";
import React from "react";

export default async function UpdatedAt() {
  const updatedAt = await readUpdateDate();

  return (
    <div className="sticky top-14 z-10 px-4 py-2 text-sm text-muted-foreground border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {updatedAt ? (
        <div className="m-auto max-w-7xl flex justify-between">
          <p>최근 업데이트: <span className="font-medium">{format(new Date(updatedAt), "yyyy-MM-dd HH:mm")}</span></p>
          <p>(※ 매 10분마다 업데이트 됩니다.)</p>
        </div>
      ) : (
        <p>업데이트 기록 없음</p>
      )}
    </div>
  );
}

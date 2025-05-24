"use client";

import React, { useEffect, useState } from "react";
import { readOverviewData, type OverviewData } from "@/lib/actions";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  candidateColorMap,
  candidatesEnum,
  genderToKo,
  type VoteCandidate,
  type VoteGender,
} from "@/lib/vars";
import FadeIn from "@/app/_components/vote/FadeIn";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";

export default function CandidateCards() {
  const isMobile = useIsMobile();
  const [pinnedArr, setPinnedArr] = useState<boolean[]>(candidatesEnum.map(() => false));

  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    readOverviewData()
    .then(setData)
    .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="text-center text-muted-foreground py-10 text-sm">
        로딩 중...
      </div>
    );
  }

  const sorted = Object.entries(data).sort(([, a], [, b]) => b.total - a.total);
  const totalCnt = Object.entries(data).reduce((val, [, curr]) => val + curr.total, 0);

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {sorted.map(([candidate, item], idx) => (
        <FadeIn key={candidate} showing={true} delay={idx * 0.1}>
          <Card
            onClick={() => {
              pinnedArr[idx] = !pinnedArr[idx];
              setPinnedArr([...pinnedArr]);
            }}
            className={cn(
              `
                relative p-0 text-white w-fit h-fit group overflow-hidden duration-500 pt-6
                flex flex-col justify-end
              `,
              item.total === 0
                ? "brightness-50 grayscale-35"
                : "cursor-pointer hover:scale-[1.02]"
            )}
            style={{
              marginTop: 15 * idx,
              height: `calc(100% - ${15 * idx}px)`,
              backgroundColor: candidateColorMap[candidate as VoteCandidate],
            }}
          >
            <h2 className="absolute text-xl font-bold top-3 left-5 capitalize">
              <span className="font-light text-base">
                {((item.total / totalCnt) * 100).toFixed(1)}%
              </span>
              <br />
              <strong>{idx + 1}. </strong>{candidate}
            </h2>
            <Image
              src={`/assets/${candidate}-transparent.png`}
              width={300}
              height={450}
              alt={candidate}
              className="w-full h-full max-w-80 aspect-[2/3] object-cover"
            />
            {item.total > 0 && (
              <CandidateCardContent item={item} pinned={isMobile || pinnedArr[idx]} />
            )}
          </Card>
        </FadeIn>
      ))}
    </div>
  );
}

function CandidateCardContent({
  item,
  pinned,
}: {
  item: OverviewData[VoteCandidate];
  pinned: boolean;
}) {
  return (
    <div
      className={cn(
        `
        absolute w-full h-[50%] flex flex-col justify-end bottom-0 left-0 
        px-6 py-8 space-y-1 text-lg [&_span]:text-base [&_span]:mr-2
        bg-[linear-gradient(to_top,black_30%,transparent_100%)] 
        duration-500 
        group-hover:opacity-100 group-hover:translate-y-0 
        opacity-0 translate-y-full
        `,
        pinned && "opacity-100 translate-y-0"
      )}
    >
      {/* 압정 아이콘 */}
      {pinned && (
        <div className="self-end text-white opacity-80">
          <Pin />
        </div>
      )}

      <p>
        <span>총 투표수:</span>
        <b>{item.total.toLocaleString()}</b>
      </p>
      <p>
        <span>연령대 Top:</span>
        <b>{item.topAgeGroup}세</b>
      </p>
      <p>
        <span>성별 Top:</span>
        <b>{genderToKo[item.topGender as VoteGender]}</b>
      </p>
      <p>
        <span>지역 Top:</span>
        <b>{item.topRegion}</b>
      </p>
    </div>
  );
}

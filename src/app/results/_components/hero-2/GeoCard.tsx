"use client";

import React, { useEffect, useState } from "react";
import type { RegionRankData } from "@/lib/actions";
import { useAtom } from "jotai";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { VoteRegion } from "@/lib/vars";
import { clickRegionAtom } from "./atoms";
import { candidateColorMap } from "@/lib/vars";
import RegionPieChart from "./RegionPieChart";
import { CircleX } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";

export default function GeoCard({ data }: { data: RegionRankData }) {
  const [clickRegion] = useAtom(clickRegionAtom);
  const [currentRegion, setCurrentRegion] = useState<VoteRegion | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setCurrentRegion(clickRegion);
  }, [clickRegion]);

  if (isMobile) return;

  if (!currentRegion || !data[currentRegion]) {
    return (
      <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
        지역을 클릭해 보세요.
      </div>
    );
  }

  const regionRanks = data[currentRegion].filter((rank) => rank.count > 0);
  const totalVotes = regionRanks.reduce((sum, curr) => sum + curr.count, 0);

  return (
    <Card className="w-fit relative bg-white shadow-lg border border-gray-100">
      <div 
        className="cursor-pointer absolute top-4 right-4 hover:text-primary duration-300 active:scale-90"
        onClick={() => setCurrentRegion(null)}
      >
        <CircleX className="w-6 h-6"/>
      </div>
      <CardHeader className="pb-2">
        <h4 className="text-lg font-semibold text-gray-800">{currentRegion}</h4>
        <p className="text-sm text-gray-500">
          총 투표 수: {totalVotes.toLocaleString()}표
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalVotes > 0 && <RegionPieChart data={regionRanks} />}

        {regionRanks.map((rank) => {
          const percentage = ((rank.count / totalVotes) * 100).toFixed(1);
          return (
            <div
              key={rank.candidate}
              className="flex justify-between items-center text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: candidateColorMap[rank.candidate] }}
                />
                <span className="text-gray-700 font-medium capitalize">
                  {rank.candidate}
                </span>
              </div>
              <div className="text-gray-600">
                {rank.count.toLocaleString()}표 ({percentage}%)
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

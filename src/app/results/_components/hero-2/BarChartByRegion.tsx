"use client";

import { BarChart, Bar, XAxis, CartesianGrid, LabelList } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import type { RegionRankData } from "@/lib/actions";
import {
  type VoteRegion,
  candidatesEnum,
  candidateColorMap,
  type VoteCandidate,
} from "@/lib/vars";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ChartDatum = {
  region: VoteRegion;
} & { [candidate: string]: number };

export default function BarChartByRegionStacked({
  data,
}: {
  data: RegionRankData;
}) {
  const [selectedCandidates, setSelectedCandidates] = useState<
    Set<VoteCandidate>
  >(new Set(candidatesEnum));

  // 1. chartData 변환
  const chartData: ChartDatum[] = Object.entries(data).map(([region, list]) => {
    const row = { region: region as VoteRegion } as ChartDatum;
    list.forEach(({ candidate, count }) => {
      row[candidate] = count;
    });
    return row;
  });

  // 2. ChartConfig
  const chartConfig = Object.fromEntries(
    candidatesEnum.map((candidate) => [
      candidate,
      {
        label: candidate,
        color: candidateColorMap[candidate],
      },
    ])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>지역별 지지율 Bar Chart</CardTitle>
        <CardDescription>각 지역에서 후보별 득표 수를 표시</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            accessibilityLayer
            barGap={0}
            barCategoryGap={10}
            margin={{ top: 24, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="region"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {candidatesEnum
              .filter((candidate) => selectedCandidates.has(candidate))
              .map((candidate) => (
                <Bar
                  key={candidate}
                  dataKey={candidate}
                  fill={candidateColorMap[candidate]}
                >
                  <LabelList
                    position="top"
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div>
          <p className="text-sm text-gray-500">후보자 필터링</p>
          <div className="h-2" />
          <div>
            <ToggleGroup
              variant={"outline"}
              type="multiple"
              className="flex flex-wrap border"
              value={[...selectedCandidates]}
              onValueChange={(values: string[]) => {
                setSelectedCandidates(new Set(values as VoteCandidate[]));
              }}
            >
              {candidatesEnum.map((candidate) => (
                <ToggleGroupItem
                  key={candidate}
                  value={candidate}
                  className="text-sm px-6 font-medium cursor-pointer hover:brightness-90"
                  style={{
                    color: candidateColorMap[candidate],
                  }}
                >
                  {candidate}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

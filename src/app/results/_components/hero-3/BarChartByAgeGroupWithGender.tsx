"use client";

import React, { useEffect, useState } from "react";
import { readRankOfAgeGroupWithGender, type AgeGroupGenderRank } from "@/lib/actions";
import {
  ageGroupsEnum,
  candidateColorMap,
  candidatesEnum,
  genderEnum,
  genderToKo,
  type VoteAgeGroup,
  type VoteCandidate,
  type VoteGender,
} from "@/lib/vars";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

type BarCounts = {
  [key in `${VoteAgeGroup}_${VoteCandidate}_${VoteGender}`]: number;
};
type BarName = {
  ageGroup: VoteAgeGroup;
};
type BarDataItem = BarName & BarCounts;

type ChartConfig = Record<
  `${VoteAgeGroup}_${VoteCandidate}_${VoteGender}`,
  {
    label: string;
    color: string;
  }
>;

export default function BarChartByAgeGroupWithGender() {
  const [data, setData] = useState<AgeGroupGenderRank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    readRankOfAgeGroupWithGender()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="text-center py-10 text-sm text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  const chartData = transformAgeGroupGenderRankToBarDataItems(data);
  const chartConfig = generateChartConfig();
  const allKeys = Object.keys(chartConfig) as Array<keyof typeof chartConfig>;

  return (
    <ChartContainer config={chartConfig}>
      <BarChart 
        accessibilityLayer 
        data={chartData}
        barGap={0}
        margin={{ top: 24, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="ageGroup"
          tickMargin={6}
        />
        <YAxis />
        <ChartTooltip
          content={<ChartTooltipContent />}
        />

        {allKeys.map((key) => {
          const keys = key.split("_");
          const candidate = keys[1] as VoteCandidate;
          const gender = keys[2] as VoteGender;
          const isMale = gender === "male";

          return (
            <Bar
              key={key}
              dataKey={key}
              name={key}
              stackId={candidate}
              fill={chartConfig[key].color}
              fillOpacity={isMale ? 1 : 0.7}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          );
        })}
      </BarChart>
    </ChartContainer>
  );
}

function transformAgeGroupGenderRankToBarDataItems(
  rank: AgeGroupGenderRank
): BarDataItem[] {
  return ageGroupsEnum.map((ageGroup) => {
    const group = rank[ageGroup];
    const row: BarDataItem = {
      ageGroup,
    } as BarDataItem;

    candidatesEnum.forEach((candidate) => {
      genderEnum.forEach((gender) => {
        const list = group?.[gender] ?? [];
        const item = list.find((entry) => entry.candidate === candidate);
        const key = `${ageGroup}_${candidate}_${gender}` as const;
        row[key] = item?.count ?? 0;
      });
    });

    return row;
  });
}

function generateChartConfig(): ChartConfig {
  const config: ChartConfig = {} as ChartConfig;

  for (const ageGroup of ageGroupsEnum) {
    for (const candidate of candidatesEnum) {
      for (const gender of genderEnum) {
        const key = `${ageGroup}_${candidate}_${gender}` as const;
        config[key] = {
          label: `${ageGroup} ${candidate} (${genderToKo[gender]})`,
          color: candidateColorMap[candidate],
        };
      }
    }
  }

  return config;
}

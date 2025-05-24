"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { candidatesEnum, priorityQuestions } from "@/lib/vars";
import { readPriority, type PriorityRank } from "@/lib/actions";
import { useEffect, useState } from "react";

// 색상은 index 기준으로 반복
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

type PieItem = {
  name: string; // 질문
  count: number; // count
  fill: string; // 색상
};

export default function CandidatePriorityPieChart() {
  const [data, setData] = useState<PriorityRank | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    readPriority()
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

  const chartList = candidatesEnum.map((candidate) => {
    const pieData: PieItem[] = priorityQuestions.map((label, idx) => {
      const count =
        data[idx]?.find((d) => d.candidate === candidate)?.count ?? 0;
      return {
        name: label,
        count,
        fill: CHART_COLORS[idx % CHART_COLORS.length],
      };
    });

    const chartConfig: ChartConfig = pieData.reduce((acc, cur, idx) => {
      acc[cur.name] = {
        label: cur.name,
        color: CHART_COLORS[idx % CHART_COLORS.length],
      };
      return acc;
    }, {} as ChartConfig);

    return {
      candidate,
      data: pieData,
      config: chartConfig,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      {chartList.map(({ candidate, data, config }) => (
        <Card key={candidate} className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-2xl font-bold text-center">{candidate}</CardTitle>
            <CardDescription className="text-center">에게 가장 기대하는 것</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={config}
              className="mx-auto max-h-[320px] px-0 w-full"
            >
              <PieChart margin={{ top: 24, right: 0, left: 0, bottom: 24 }}>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="name"
                  labelLine={false}
                  outerRadius="80%"
                  label={({ payload, x, y, textAnchor, dominantBaseline }) => (
                    <text
                      x={x}
                      y={y}
                      textAnchor={textAnchor}
                      dominantBaseline={dominantBaseline}
                      fill="hsla(var(--foreground))"
                    >
                      {`${payload.name}: ${payload.count}`}
                    </text>
                  )}
                >
                  {data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground text-center">
            총 응답 수 {data.reduce((prev, row) => prev + row.count, 0)} 기준, 상위 기대 정책 비율
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

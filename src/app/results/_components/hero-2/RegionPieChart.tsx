import React from "react";
import { PieChart, Pie, Sector, Label } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { candidateColorMap, type VoteCandidate } from "@/lib/vars";

export default function RegionPieChart({
  data,
  activeIndex = 0,
}: {
  data: { candidate: VoteCandidate; count: number }[];
  activeIndex?: number;
}) {
  const id = "geo-region-pie";

  const chartData = data.map((item) => ({
    name: item.candidate,
    value: item.count,
    fill: candidateColorMap[item.candidate],
  }));

  const isNotHighest = chartData.slice(1).some(row => row.value === chartData[0].value);

  const chartConfig = Object.fromEntries(
    data.map((item) => [
      item.candidate,
      {
        label: item.candidate,
        color: candidateColorMap[item.candidate],
      },
    ])
  );

  return (
    <div data-chart={id} className="flex flex-col w-60">
      <ChartStyle id={id} config={chartConfig} />
      <ChartContainer
        id={id}
        config={chartConfig}
        className="mx-auto aspect-square w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
            activeIndex={isNotHighest ? undefined : activeIndex}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 10} />
                <Sector
                  {...props}
                  outerRadius={outerRadius + 25}
                  innerRadius={outerRadius + 12}
                />
              </g>
            )}
          >
            <Label
              content={({ viewBox }) => {
                const top = chartData[activeIndex];
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {top.value.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        {top.name}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}

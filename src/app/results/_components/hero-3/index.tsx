import React from "react";
import BarChartByAgeGroupWithGender from "./BarChartByAgeGroupWithGender";
import { TrendingUp } from "lucide-react";
import PriorityPieChartPerCandidate from "./PriorityPieChartPerCandidate";

export default function Hero3() {
  return (
    <div>
      <h1 className="text-4xl font-bold flex">성별 상세 차트</h1>
      <div className="h-4" />
      <p className="text-gray-500 text-lg flex items-center gap-2">
        <span>연령대 + 성별에 따라 차트를 보여줍니다.</span>
        <TrendingUp className="h-6 w-6" />
      </p>
      <div className="h-4" />
      <h4>후보별 연령대 및 성별 분포 (연령대 기준)</h4>
      <div className="h-2" />
      <p className="leading-none text-muted-foreground">
        남자는 진하게, 여자는 연하게 표시됩니다.
      </p>
      <div className="h-10" />
      <BarChartByAgeGroupWithGender />
      
      <div className="h-24" />
      <h1 className="text-4xl font-bold flex">후보자에게 기대하는 것</h1>
      <div className="h-10" />
      <PriorityPieChartPerCandidate />
    </div>
  );
}

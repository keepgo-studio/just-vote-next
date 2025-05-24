import type { RankInfo as RankInfoType } from "@/lib/actions";
import React from "react";
import { Users, MapPin, Calendar, VenusAndMars } from "lucide-react";
import { ageGroupsEnum, regionsEnum } from "@/lib/vars";

export default function RankInfo({ data }: { data: RankInfoType }) {
  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-3xl m-auto">
      {/* 총 투표 수 */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h4 className="text-lg font-semibold text-gray-800">총 투표 수</h4>
        </div>
        <p className="text-2xl font-bold text-blue-700">
          {data.totalVotes.toLocaleString()} 표
        </p>
      </div>

      {/* 성별 분포 */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <VenusAndMars className="w-5 h-5 text-pink-600" />
          <h4 className="text-lg font-semibold text-gray-800">성별 분포</h4>
        </div>
        <p className="text-md font-medium text-gray-700">
          남성: <span className="font-bold">{data.genderCount.male}</span>명 /
          여성: <span className="font-bold">{data.genderCount.female}</span>명
        </p>
      </div>

      {/* 총 지역 수 */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-5 h-5 text-green-600" />
          <h4 className="text-lg font-semibold text-gray-800">참여 지역 수</h4>
        </div>
        <p className="text-2xl font-bold text-green-700 flex gap-2 justify-between items-end">
          <span>{data.regionCount}개 지역</span>
          <span className="text-sm text-gray-500">
            총 {regionsEnum.length}개 지역
          </span>
        </p>
      </div>

      {/* 총 연령대 수 */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h4 className="text-lg font-semibold text-gray-800">
            참여 연령대 수
          </h4>
        </div>
        <p className="text-2xl font-bold text-purple-700 flex gap-2 justify-between items-end">
          <span>{data.ageGroupCount}개 연령대</span>
          <span className="text-sm text-gray-500">
            총 {ageGroupsEnum.length}개 연령대
          </span>
        </p>
      </div>
    </section>
  );
}

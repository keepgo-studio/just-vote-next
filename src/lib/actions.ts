"use server";

import { db } from "@/db";
import { voteAggregates, votes } from "@/db/schema";
import type { DZ_Vote } from "@/db/types";
import { and, count, desc, eq } from "drizzle-orm";
import {
  candidatesEnum,
  type VoteAgeGroup,
  type VoteCandidate,
  type VoteGender,
  type VoteRegion,
} from "./vars";

export async function checkVoted(userId: string) {
  const existingVote = await db
    .select()
    .from(votes)
    .where(eq(votes.userId, userId));

  if (existingVote.length > 0) {
    return existingVote[0];
  }

  return undefined;
}

export type CreateVoteParams = Omit<DZ_Vote, "createdAt">;

export async function createVote(params: CreateVoteParams) {
  const { userId, gender, ageGroup, region, voteFor, priority } = params;

  await db.insert(votes).values({
    userId,
    gender,
    ageGroup,
    region,
    voteFor,
    priority,
  });
}

export async function updateVote(params: CreateVoteParams) {
  const { userId, gender, ageGroup, region, voteFor, priority } = params;

  await db
    .update(votes)
    .set({
      gender,
      ageGroup,
      region,
      voteFor,
      priority,
    })
    .where(eq(votes.userId, userId));
}

export type OverviewData = Record<
  VoteCandidate,
  {
    total: number;
    topAgeGroup: string;
    topGender: string;
    topRegion: string;
  }
>;

export async function readOverviewData() {
  const getTotalOfCandidate = async (c: VoteCandidate) => {
    return await db
      .select({ count: voteAggregates.count })
      .from(voteAggregates)
      .where(
        and(
          eq(voteAggregates.candidate, c),
          eq(voteAggregates.category, "total")
        )
      )
      .then((res) => res[0]?.count ?? 0);
  };

  const getTopAgeRangeOfCandidate = async (c: VoteCandidate) => {
    return await db
      .select({ key: voteAggregates.key, count: voteAggregates.count })
      .from(voteAggregates)
      .where(
        and(
          eq(voteAggregates.candidate, c),
          eq(voteAggregates.category, "ageGroup")
        )
      )
      .orderBy(desc(voteAggregates.count))
      .limit(1)
      .then((res) => res[0]?.key ?? null);
  };

  const getTopGenderOfCandidate = async (c: VoteCandidate) => {
    return await db
      .select({ key: voteAggregates.key, count: voteAggregates.count })
      .from(voteAggregates)
      .where(
        and(
          eq(voteAggregates.candidate, c),
          eq(voteAggregates.category, "gender")
        )
      )
      .orderBy(desc(voteAggregates.count))
      .limit(1)
      .then((res) => res[0]?.key ?? null);
  };

  const getTopRegionOfCandidate = async (c: VoteCandidate) => {
    return await db
      .select({ key: voteAggregates.key, count: voteAggregates.count })
      .from(voteAggregates)
      .where(
        and(
          eq(voteAggregates.candidate, c),
          eq(voteAggregates.category, "region")
        )
      )
      .orderBy(desc(voteAggregates.count))
      .limit(1)
      .then((res) => res[0]?.key ?? null);
  };

  const results = await Promise.all(
    candidatesEnum.map(async (c) => {
      const [total, topAgeGroup, topGender, topRegion] = await Promise.all([
        getTotalOfCandidate(c),
        getTopAgeRangeOfCandidate(c),
        getTopGenderOfCandidate(c),
        getTopRegionOfCandidate(c),
      ]);

      return [c, { total, topAgeGroup, topGender, topRegion }];
    })
  );

  const overview: OverviewData = Object.fromEntries(results);
  return overview;
}

export type RankInfo = {
  totalVotes: number;
  genderCount: Record<VoteGender, number>;
  regionCount: number;
  ageGroupCount: number;
};

export async function readRankInfo() {
    // 1. 총 투표 수
  const [{ count: totalVotes }] = await db.select({ count: count() }).from(votes);

  // 2. 성별 분포
  const genderRows = await db
    .select({ gender: votes.gender, count: count() })
    .from(votes)
    .groupBy(votes.gender);

  const genderCount: Record<VoteGender, number> = { male: 0, female: 0 };
  for (const row of genderRows) {
    if (row.gender === "male" || row.gender === "female") {
      genderCount[row.gender] = row.count;
    }
  }

  // 3. 고유 지역 수
  const regionRows = await db.selectDistinct({ region: votes.region }).from(votes);
  const regionCount = regionRows.length;

  // 4. 고유 연령대 수
  const ageGroupRows = await db.selectDistinct({ ageGroup: votes.ageGroup }).from(votes);
  const ageGroupCount = ageGroupRows.length;

  return {
    totalVotes,
    genderCount,
    regionCount,
    ageGroupCount,
  };
}

export type RegionRankData = Record<
  VoteRegion,
  {
    candidate: VoteCandidate;
    count: number;
  }[]
>;

export async function readRankOfRegion() {
  // 1. 전체 지역 후보별 집계 데이터 가져오기
  const rows = await db
    .select({
      candidate: voteAggregates.candidate,
      region: voteAggregates.key,
      count: voteAggregates.count,
    })
    .from(voteAggregates)
    .where(eq(voteAggregates.category, "region"))
    .orderBy(voteAggregates.key, desc(voteAggregates.count));

  return rows.reduce((obj, row) => {
    const { candidate, count } = row;
    const region = row.region as VoteRegion;

    if (!obj[region]) {
      obj[region] = [];
    }

    // 이미 정렬되어있으므로 그냥 삽입
    obj[region].push({
      candidate: candidate as VoteCandidate,
      count,
    });

    return obj;
  }, {} as RegionRankData);
}

export type AgeGroupGenderRank = Record<
  VoteAgeGroup,
  Partial<
    Record<
      VoteGender,
      {
        candidate: VoteCandidate;
        count: number;
      }[]
    >
  >
>;

export async function readRankOfAgeGroupWithGender() {
  const rows = await db
    .select({
      candidate: voteAggregates.candidate,
      key: voteAggregates.key, // expected to be `${ageGroup}_${gender}
      count: voteAggregates.count,
    })
    .from(voteAggregates)
    .where(eq(voteAggregates.category, "ageGroup-gender"))
    .orderBy(voteAggregates.key, desc(voteAggregates.count));

  return rows.reduce((obj, row) => {
    const { candidate, count } = row;
    const keys = row.key.split("_");
    const ageGroup = keys[0] as VoteAgeGroup;
    const gender = keys[1] as VoteGender;

    if (!obj[ageGroup]) {
      obj[ageGroup] = {};
    }

    if (!obj[ageGroup][gender]) {
      obj[ageGroup][gender] = [];
    }

    obj[ageGroup][gender].push({
      candidate,
      count,
    });

    return obj;
  }, {} as AgeGroupGenderRank);
}

export type AgeGroupRegionRank = Record<
  VoteAgeGroup,
  Partial<
    Record<
      VoteRegion,
      {
        candidate: VoteCandidate;
        count: number;
      }[]
    >
  >
>;

export type PriorityRank = {
  [priorityIdx: number]: {
    candidate: VoteCandidate;
    count: number;
  }[];
};

export async function readPriority() {
  const rows = await db
    .select({
      candidate: voteAggregates.candidate,
      key: voteAggregates.key,
      count: voteAggregates.count,
    })
    .from(voteAggregates)
    .where(eq(voteAggregates.category, "priority"));

  const result: PriorityRank = {};

  for (const row of rows) {
    const idx = parseInt(row.key, 10);
    if (!result[idx]) result[idx] = [];
    result[idx].push({ candidate: row.candidate, count: row.count });
  }

  for (const list of Object.values(result)) {
    list.sort((a, b) => b.count - a.count);
  }

  return result;
}

export async function readUpdateDate() {
  const [latest] = await db
    .select({ updateAt: voteAggregates.updatedAt })
    .from(voteAggregates)
    .orderBy(desc(voteAggregates.updatedAt))
    .limit(1);

  return latest?.updateAt ?? null;
}
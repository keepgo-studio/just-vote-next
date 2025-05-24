"use client"

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ageGroupsEnum, type VoteAgeGroup } from "@/lib/vars";
import type { VoteActorRef } from "@/lib/vote.machine";
import FadeIn from "./FadeIn";
import { useStepVisibility } from "@/app/_hooks/useStepVisibility";
import { useSelector } from "@xstate/react";

export default function AgeRange({ actorRef }: { actorRef: VoteActorRef }) {
  const shouldShow = useStepVisibility(actorRef, "chooseAgeRange", "voting");
  const selected = useSelector(actorRef, state => state.context.ageGroup);

  const handleChange = (value: VoteAgeGroup) => {
    actorRef.send({ type: "CHOOSE_AGE", value });
  };

  return (
    <FadeIn showing={shouldShow}>
      <Select value={selected ?? undefined} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="연령대를 고르세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>연령대</SelectLabel>
            {ageGroupsEnum.map((ageGroup) => (
              <SelectItem key={ageGroup} value={ageGroup}>
                {ageGroup.replace("-", " ~ ")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FadeIn>
  );
}

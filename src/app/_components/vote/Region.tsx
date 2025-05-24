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
import { regionsEnum, type VoteRegion } from "@/lib/vars";
import type { VoteActorRef } from "@/lib/vote.machine";
import FadeIn from "./FadeIn";
import { useStepVisibility } from "@/app/_hooks/useStepVisibility";
import { useSelector } from "@xstate/react";

export default function Region({ actorRef }: { actorRef: VoteActorRef }) {
  const shouldShow = useStepVisibility(actorRef, "chooseRegion", "voting");
  const selected = useSelector(actorRef, state => state.context.region);

  const handleChange = (value: VoteRegion) => {
    actorRef.send({ type: "CHOOSE_REGION", value });
  };

  return (
    <FadeIn showing={shouldShow}>
      <Select value={selected ?? undefined} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="지역을 고르세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>지역</SelectLabel>
            {regionsEnum.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FadeIn>
  );
}

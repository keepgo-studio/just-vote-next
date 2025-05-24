"use client";

import React from "react";
import type { VoteActorRef } from "@/lib/vote.machine";
import FadeIn from "./FadeIn";
import { useStepVisibility } from "@/app/_hooks/useStepVisibility";
import { Card, CardContent } from "@/components/ui/card";
import { candidatesEnum, type VoteCandidate } from "@/lib/vars";
import { cn } from "@/lib/utils";
import { useSelector } from "@xstate/react";
import Image from "next/image";

export default function Candidate({ actorRef }: { actorRef: VoteActorRef }) {
  const shouldShow = useStepVisibility(actorRef, "chooseCandidate", "voting");
  const selected = useSelector(actorRef, (s) => s.context.voteFor ?? null);

  const handleSelect = (value: VoteCandidate) => {
    actorRef.send({ type: "CHOOSE_CANDIDATE", value });
  };

  return (
    <FadeIn showing={shouldShow}>
      <div className="flex md:flex-row gap-3 justify-center items-center">
        {candidatesEnum.map((candidate) => {
          const isSelected = selected === candidate;
          return (
            <Card
              key={candidate}
              onClick={() => handleSelect(candidate)}
              className={cn(
                "w-fit cursor-pointer overflow-hidden border rounded-lg shadow-sm transition-transform duration-200 p-0",
                isSelected
                  ? "border-blue-600 scale-[1.02] bg-blue-50"
                  : "hover:shadow-md hover:border-gray-300"
              )}
            >
              <CardContent className="p-0">
                <Image
                  src={`/assets/${candidate}.webp`}
                  alt={candidate}
                  width={400}
                  height={600}
                  className="object-cover bg-white aspect-[2/3]"
                />
                <div
                  className={cn(
                    "p-4 text-center font-semibold text-sm sm:text-lg transition-colors",
                    isSelected ? "text-blue-700" : "text-gray-800"
                  )}
                >
                  {candidate}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </FadeIn>
  );
}

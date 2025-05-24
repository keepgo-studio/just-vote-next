"use client";

import { useStepVisibility } from "@/app/_hooks/useStepVisibility";
import type { VoteActorRef } from "@/lib/vote.machine";
import { useSelector } from "@xstate/react";
import React from "react";
import { priorityQuestions } from "@/lib/vars";
import FadeIn from "./FadeIn";
import { cn } from "@/lib/utils";

export default function Priority({ actorRef }: { actorRef: VoteActorRef }) {
  const shouldShow = useStepVisibility(actorRef, "choosePriority", "voting");
  const selectedIdx = useSelector(actorRef, (s) => s.context.priority ?? null);

  const handleSelect = (value: number) => {
    actorRef.send({ type: "CHOOSE_PRIORITY", value });
  };

  return (
    <FadeIn showing={shouldShow}>
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">
          Q. 당신이 대통령에게 가장 기대하는 것은 무엇입니까?
        </h4>

        <ul className="grid gap-3">
          {priorityQuestions.map((question, idx) => (
            <li
              key={question}
              onClick={() => handleSelect(idx)}
              className={cn(
                "cursor-pointer border rounded-md px-4 py-3 transition-colors",
                selectedIdx === idx
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              )}
            >
              {question}
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}

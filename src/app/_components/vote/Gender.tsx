"use client";

import React from "react";
import type { VoteActorRef } from "@/lib/vote.machine";
import FadeIn from "./FadeIn";
import { useStepVisibility } from "@/app/_hooks/useStepVisibility";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { genderEnum, type VoteGender } from "@/lib/vars";
import { Label } from "@/components/ui/label";
import { useSelector } from "@xstate/react";

export default function Gender({ actorRef }: { actorRef: VoteActorRef }) {
  const shouldShow = useStepVisibility(actorRef, "chooseGender", "voting");
  const selected = useSelector(actorRef, (state) => state.context.gender);

  const handleChange = (value: VoteGender) => {
    actorRef.send({ type: "CHOOSE_GENDER", value });
  };

  return (
    <FadeIn showing={shouldShow}>
      <div className="w-full space-y-4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="font-bold text-gray-800">성별을 선택하세요</h2>
        <RadioGroup
          value={selected}
          onValueChange={handleChange}
          className="flex gap-2 justify-around"
        >
          {genderEnum.map((gender) => (
            <div
              key={gender}
              className={`flex items-center space-x-2 rounded-lg border w-full
                ${
                  selected === gender
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                } 
                transition duration-200`}
            >
              <Label
                htmlFor={`gender-${gender}`}
                className="px-4 py-2 w-full text-sm font-medium text-gray-700 cursor-pointer"
              >
                <RadioGroupItem value={gender} id={`gender-${gender}`} />
                {gender === "male" ? "남성" : "여성"}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </FadeIn>
  );
}

import { useStepVisibility } from "@/app/_hooks/useStepVisibility";
import type { VoteActorRef } from "@/lib/vote.machine";
import React from "react";
import FadeIn from "./FadeIn";
import { Button } from "@/components/ui/button";

export default function Quit({ actorRef }: { actorRef: VoteActorRef }) {
  const shouldShow = useStepVisibility(actorRef, "init", "voting");

  return (
    <FadeIn showing={shouldShow}>
      <Button variant="secondary" onClick={() => actorRef.send({ type: "END_VOTE" })}>
        다음에 하기
      </Button>
    </FadeIn>
  );
}

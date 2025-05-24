"use client";

import { useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import type { VoteActorRef, VoteActorState } from "@/lib/vote.machine";

const orderOfState: Record<VoteActorState, number> = {
  init: 0,
  chooseAgeRange: 1,
  chooseRegion: 2,
  chooseGender: 3,
  chooseCandidate: 4,
  choosePriority: 5,
  voting: 6,
  done: 7,
  error: 99,
  complete: 99,
};

export function useStepVisibility(
  actorRef: VoteActorRef,
  targetState: VoteActorState,
  untilState?: VoteActorState
): boolean {
  const shouldShow = useSelector(
    actorRef,
    (state) =>
      orderOfState[targetState] <= orderOfState[state.value] &&
      orderOfState[state.value] < orderOfState[untilState ?? "complete"]
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(prev => prev === false ? shouldShow: true);
  }, [shouldShow]);

  return visible;
}

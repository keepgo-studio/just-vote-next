import { useStepVisibility } from '@/app/_hooks/useStepVisibility';
import type { VoteActorRef } from '@/lib/vote.machine';
import React from 'react'
import FadeIn from './FadeIn';
import { Button } from '@/components/ui/button';

export default function Submit({ actorRef }: { actorRef: VoteActorRef }) {
  const shouldShow = useStepVisibility(actorRef, "choosePriority", "voting");
  
  return (
    <FadeIn showing={shouldShow}>
      <div className='flex justify-end'>
        <Button onClick={() => actorRef.send({ type: "VOTE" })}>제출하기</Button>
      </div>
    </FadeIn>
  )
}

"use client"

import React, { useEffect } from 'react'
import { useActorRef, useSelector } from '@xstate/react';
import { voteMachine } from '@/lib/vote.machine';
import { useRouter } from 'next/navigation';
import AgeRange from './AgeRange';
import Region from './Region';
import Gender from './Gender';
import Candidate from './Candidate';
import Priority from './Priority';
import ErrorPage from './ErrorPage';
import Loading from './Loading';
import Done from './Done';
import Quit from './Quit';
import type { DZ_Vote } from '@/db/types';
import Submit from './Submit';

export default function VoteForm({ 
  userId,
  initData
}: { 
  userId: string,
  initData?: DZ_Vote
}) {
  const router = useRouter();
  const actorRef = useActorRef(voteMachine);
  const isError = useSelector(actorRef, state => state.matches("error"));
  const isLoading = useSelector(actorRef, state => state.matches("voting"));
  const isComplete = useSelector(actorRef, state => state.matches("complete"));
  const isDone = useSelector(actorRef, state => state.matches("done"));

  useEffect(() => {
    actorRef.send({ type: "START_VOTE", userId });
  }, [actorRef, userId]);

  useEffect(() => {
    if (initData) {
      actorRef.send({ type: "UPDATE_ALL", data: initData });
    }
  }, [actorRef, initData]);

  useEffect(() => {
    if (isComplete) {
      router.push("/results");
    }
  }, [router, isComplete]);

  if (isError) return <ErrorPage />

  if (isLoading) return <Loading />

  if (isDone) return <Done />;

  return (
    <section>
      <Quit actorRef={actorRef}/>

      <div className='h-6' />

      <div className='space-y-3'>
        <AgeRange actorRef={actorRef}/>
        <Region actorRef={actorRef}/>
        <Gender actorRef={actorRef}/>
        <div className='h-4'/>
        <Candidate actorRef={actorRef}/>
        <div className='h-4'/>
        <Priority actorRef={actorRef}/>
        <div className='h-8'/>
        <Submit actorRef={actorRef}/>
      </div>
    </section>
  )
}

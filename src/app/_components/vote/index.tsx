import React from 'react'
import { checkVoted } from '@/lib/actions';
import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import VoteForm from './VoteForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default async function Vote({ 
  session,
  mode
}: { 
  session: Session | null;
  mode?: string
}) {
  if (!session?.user?.id) {
    redirect("/login");
  }

  const isUpdateMode = mode === "update";
  const userId = session.user.id;
  const voteData = await checkVoted(userId);

  if (!isUpdateMode && voteData) {
    redirect("/results");
  }

  return (
    <Card className='w-full max-w-2xl min-h-96'>
      <CardHeader className='text-center text-2xl font-bold'>
        여론 조사 참여
      </CardHeader>
      <CardContent>
        <VoteForm userId={userId} initData={voteData}/>
      </CardContent>
    </Card>
  )
}

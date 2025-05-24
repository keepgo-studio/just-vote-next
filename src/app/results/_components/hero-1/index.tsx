import React from 'react'
import CandidateCards from './CandidateCards'
import { readOverviewData, readRankInfo } from '@/lib/actions'
import { MousePointerClick } from 'lucide-react';
import RankInfo from './RankInfo';

export default async function Hero1() {
  const cardData = await readOverviewData();
  const rankInfo = await readRankInfo();

  return (
    <div>
      <h1 className='text-4xl font-bold flex'>각 후보 지지율</h1>
      <div className='h-4'/>
      <p className='text-gray-500 text-lg'>아래에 지지율에 따라 순서대로 보여집니다.</p>
      <div className='h-2'/>
      <p className='max-md:hidden text-gray-500 text-sm flex items-center gap-2'>
        <MousePointerClick/>
        카드를 누르면 텍스트가 고정됩니다.
      </p>
      <div className='h-4'/>
      <div className='h-10'/>
      <CandidateCards data={cardData}/>

      <div className='h-10'/>
      <h1 className='text-2xl font-bold'>투표 정보</h1>
      <div className='h-4'/>
      <RankInfo data={rankInfo}/>
    </div>
  );
}

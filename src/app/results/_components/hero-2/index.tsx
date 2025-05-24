import { readRankOfRegion } from '@/lib/actions'
import React from 'react'
import GeoMap from './GeoMap';
import GeoCard from './GeoCard';
import { MousePointerClick } from 'lucide-react';
import BarChartByRegion from './BarChartByRegion';

export default async function Hero2() {
  const data = await readRankOfRegion();

  return (
    <div>
      <h1 className='text-4xl font-bold flex'>지역별 지지율</h1>
      <div className='h-4'/>
      <p className='text-gray-500 text-lg'>가장 높은 지지율로 색이 칠해집니다.</p>
      <p className='text-gray-500 text-lg'>가장 높은 지지율이 없다면 색이 칠해지지 않습니다.</p>
      <div className='h-2'/>
      <p className='text-gray-500 text-sm flex items-center gap-2'>
        <MousePointerClick/>
        지역을 누르면 상세 차트가 등장합니다.
      </p>
      <div className='h-4'/>
      <div className='h-10'/>
      <section className='relative w-full'>
        <GeoMap data={data}/>
        <div className='absolute top-6 right-6'>
          <GeoCard data={data}/>
        </div>
      </section>
      
      <div className='h-10'/>
      <BarChartByRegion data={data}/>
    </div>
  );
}

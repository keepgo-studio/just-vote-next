import React from 'react'
import { Loader2 } from 'lucide-react'
import FadeIn from './FadeIn'

export default function Loading() {
  return (
    <FadeIn showing={true}>
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-gray-700 font-medium text-lg">로딩 중입니다...</p>
        </div>
      </div>
    </FadeIn>
  )
}

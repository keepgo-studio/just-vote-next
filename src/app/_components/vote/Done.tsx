"use client"

import React from 'react'
import FadeIn from './FadeIn';
import { CheckCircle } from 'lucide-react';

export default function Done() {
  return (
    <FadeIn showing={true}>
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">투표가 완료되었습니다!</h2>
        <p className="text-gray-600">소중한 한 표 감사합니다.</p>
      </div>
    </FadeIn>
  );
}

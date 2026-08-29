'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/store/report-store';
import AIScanningWorkspace from '@/components/AIScanningWorkspace';
import { FALLBACK_AI_ANALYSIS } from '@/lib/demo-data';

export default function AnalyzePage() {
  const router = useRouter();
  const { imageUrl, aiAnalysis } = useReportStore();

  const activeImage = imageUrl || '/demo-pothole.jpg';
  const activeAnalysis = aiAnalysis || FALLBACK_AI_ANALYSIS;

  const handleConfirm = () => {
    router.push('/intelligence');
  };

  const handleChangeCategory = () => {
    router.push('/report');
  };

  return (
    <div className="px-4 md:px-8 pt-6 pb-12 max-w-7xl mx-auto">
      <AIScanningWorkspace
        imageUrl={activeImage}
        analysis={activeAnalysis}
        onConfirm={handleConfirm}
        onChangeCategory={handleChangeCategory}
        onBack={() => router.push('/report')}
      />
    </div>
  );
}

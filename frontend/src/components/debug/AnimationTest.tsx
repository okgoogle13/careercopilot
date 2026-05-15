import React from 'react';
import { SolidarityUprising } from '@/components/kerala-rage/SolidarityUprising';
import { Scaffold } from '@/components/archetypes';

export default function AnimationTestPage() {
  return (
    <Scaffold className="p-8">
      <h1
        className="text-2xl font-bold mb-8"
        style={{
          color: 'var(--sys-color-worker-ash-base)',
          fontFamily: 'var(--sys-type-font-fraunces)',
        }}
      >
        Solidarity Uprising - Motion Physics Test
      </h1>
      <div className="max-w-4xl mx-auto border border-[var(--sys-color-concreteGrey-base)] rounded-lg overflow-hidden">
        <SolidarityUprising />
      </div>
    </Scaffold>
  );
}

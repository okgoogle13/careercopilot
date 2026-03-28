import { SolidarityUprising } from '../components/kerala-rage/SolidarityUprising';

export default function AnimationTestPage() {
  return (
    <div className="min-h-screen bg-[--sys-color-charcoalBackground-base] p-8">
      <h1 className="text-[--sys-color-worker-ash-base] text-2xl font-bold mb-8">
        Solidarity Uprising - Motion Physics Test
      </h1>
      <div className="max-w-4xl mx-auto border border-[--sys-color-concreteGrey-base] rounded-lg overflow-hidden">
        <SolidarityUprising />
      </div>
    </div>
  );
}

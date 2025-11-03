import React, { useEffect } from 'react';
import useExampleStore from '../stores/useExampleStore';

const ExamplePage: React.FC = () => {
  const { data, isLoading, error, fetchExampleData } = useExampleStore();

  useEffect(() => {
    fetchExampleData();
  }, [fetchExampleData]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-4">No data</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{data.content}</h1>
      <p className="mt-2 text-sm text-gray-600">Confidence: {data.confidence_score}</p>
    </div>
  );
};

export default ExamplePage;

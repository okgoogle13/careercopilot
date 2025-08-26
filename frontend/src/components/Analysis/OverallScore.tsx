import React from 'react';

interface OverallScoreProps {
  score: number;
}

export const OverallScore: React.FC<OverallScoreProps> = ({ score }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
          ></path>
          <path
            className="text-blue-500"
            strokeDasharray={`${score}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
          ></path>
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-4xl font-bold">{score}</span>
          <span className="block text-sm">Overall Score</span>
        </div>
      </div>
    </div>
  );
};

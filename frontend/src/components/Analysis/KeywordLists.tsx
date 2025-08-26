import React from 'react';

interface KeywordListsProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export const KeywordLists: React.FC<KeywordListsProps> = ({
  matchedKeywords,
  missingKeywords,
}) => {
  return (
    <>
      <div>
        <h3 className="text-xl font-semibold mb-3">Matched Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {matchedKeywords.map((kw, i) => (
            <span
              key={kw}
              className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-3">Missing Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((kw, i) => (
            <span
              key={i}
              className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

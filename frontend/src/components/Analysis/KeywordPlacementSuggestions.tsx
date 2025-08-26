import React from 'react';

interface KeywordPlacementSuggestion {
  keyword: string;
  suggested_location: string;
  example_sentence: string;
}

interface KeywordPlacementSuggestionsProps {
  suggestions: KeywordPlacementSuggestion[];
}

export const KeywordPlacementSuggestions: React.FC<KeywordPlacementSuggestionsProps> = ({
  suggestions,
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Keyword Placement Suggestions
      </h3>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.keyword}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <h4 className="font-bold text-lg text-gray-900">
              Keyword:{' '}
              <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded-md">
                {suggestion.keyword}
              </span>
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Suggested Location:</span>{' '}
              {suggestion.suggested_location}
            </p>
            <p className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded-md border-l-4 border-gray-300">
              <span className="font-semibold">Example:</span> "
              {suggestion.example_sentence}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

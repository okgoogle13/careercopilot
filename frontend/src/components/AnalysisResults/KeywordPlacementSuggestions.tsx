import React from 'react';

interface KeywordPlacementSuggestion {
  keyword: string;
  suggested_location: string;
  example_sentence: string;
}

interface KeywordPlacementSuggestionsProps {
  suggestions: KeywordPlacementSuggestion[];
}

/**
 * Displays detailed suggestions for where and how to place missing keywords
 */
export const KeywordPlacementSuggestions: React.FC<
  KeywordPlacementSuggestionsProps
> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="mr-2">💡</span>
        Keyword Placement Suggestions
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Here are specific recommendations for incorporating missing keywords
        into your resume:
      </p>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h4 className="font-bold text-lg text-gray-900">Keyword:</h4>
              <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-md text-sm">
                {suggestion.keyword}
              </span>
            </div>

            <div className="mb-3">
              <span className="font-semibold text-gray-700 text-sm">
                💼 Suggested Location:
              </span>
              <p className="text-gray-800 mt-1 font-medium">
                {suggestion.suggested_location}
              </p>
            </div>

            <div className="bg-white p-4 rounded-md border-l-4 border-blue-400">
              <span className="font-semibold text-gray-700 text-sm flex items-center mb-2">
                <span className="mr-1">📝</span>
                Example:
              </span>
              <p className="text-gray-800 italic leading-relaxed">
                "{suggestion.example_sentence}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>💡 Pro Tip:</strong> When incorporating these keywords, make
          sure they fit naturally within the context of your experience. Avoid
          keyword stuffing and focus on authentic descriptions of your skills
          and accomplishments.
        </p>
      </div>
    </div>
  );
};

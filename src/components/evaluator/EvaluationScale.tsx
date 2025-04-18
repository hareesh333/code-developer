import React from 'react';

export default function EvaluationScale() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Evaluation scale</label>
        <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
          <option>Binary (Yes/No)</option>
        </select>
      </div>

      <div className="flex gap-8 text-sm text-gray-600">
        <div>YES Score = 1</div>
        <div>NO Score = 0</div>
      </div>

      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
        Example: Respond with a yes if the answer meets all the requirements above; if the answer
        doesn't match with any one of the above requirements, respond with a no.
      </div>
    </div>
  );
}
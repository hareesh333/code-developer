import React from 'react';
import { Play } from 'lucide-react';

const sampleOutput = {
  result: "No",
  reasoning: "The output is in a single line instead of multiple words.",
  logs: [],
  usage: {
    prompt_tokens: 385,
    completion_tokens: 24,
    total_tokens: 409,
    latency: 549.5107
  },
  cost: {
    input: 0.00019250000000000002,
    output: 0.000036,
    total: 0.00022850000000000002
  }
};

export default function Playground() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">output</label>
        <textarea
          defaultValue="rdj is ironman"
          className="w-full h-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Evaluator output</label>
        <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(sampleOutput, null, 2)}
        </pre>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
        <Play className="w-4 h-4" />
        Run
      </button>
    </div>
  );
}
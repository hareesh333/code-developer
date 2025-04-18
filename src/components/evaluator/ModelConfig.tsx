import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ModelConfig() {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
          <option>GPT 3.5 Turbo 16k</option>
        </select>
      </div>

      <div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-primary text-sm hover:underline flex items-center gap-1"
        >
          {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showConfig ? 'Hide configuration parameters' : 'View configuration parameters'}
        </button>

        {showConfig && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Temperature</label>
              <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Max Tokens</label>
              <input
                type="number"
                min="1"
                max="4096"
                defaultValue="256"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stop</label>
              <input
                type="text"
                placeholder="Add stop sequence"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Top P</label>
              <input type="range" min="0" max="1" step="0.1" defaultValue="1" className="w-full" />
            </div>

            <button className="text-primary text-sm hover:underline">
              Advanced parameters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
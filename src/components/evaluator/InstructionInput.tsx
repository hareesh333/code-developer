import React from 'react';

export default function InstructionInput() {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Describe your requirements in plain English
      </label>
      <textarea
        className="w-full h-32 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        placeholder="Example: Check if the {{output}} is factually correct based on the {{input}} and {{context}}"
      />
    </div>
  );
}
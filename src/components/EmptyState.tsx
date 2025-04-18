import React from 'react';
import { Database, Upload, Plus } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <Database className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-textPrimary mb-2">Add your first dataset</h2>
      <p className="text-textSecondary mb-6 max-w-md">
        Create, update, and manage datasets throughout your development lifecycle.
        Use them to evaluate your prompts and workflows.
      </p>
      
      <div className="flex space-x-4 mb-8">
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create new
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV
        </button>
      </div>
      
      <div className="text-sm">
        <span className="text-textSecondary">Need a quick example? </span>
        <a href="#" className="text-primary hover:underline">
          View sample datasets
        </a>
      </div>
    </div>
  );
}
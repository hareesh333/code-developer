import React from 'react';
import { Info } from 'lucide-react';

export default function InfoBanner() {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start gap-3">
      <Info className="w-5 h-5 text-blue-500 mt-0.5" />
      <div className="text-sm text-blue-700">
        Use &#123;&#123;&#125;&#125; to reference dynamic variables in your evaluator instructions.{' '}
        <a href="#" className="underline hover:text-blue-800">
          Learn more
        </a>
      </div>
    </div>
  );
}
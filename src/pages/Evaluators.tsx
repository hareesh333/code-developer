import React from 'react';
import InfoBanner from '../components/evaluator/InfoBanner';
import ModelConfig from '../components/evaluator/ModelConfig';
import InstructionInput from '../components/evaluator/InstructionInput';
import EvaluationScale from '../components/evaluator/EvaluationScale';
import Playground from '../components/evaluator/Playground';
import EvaluatorFeatureSidebar from '../components/evaluator/EvaluatorFeatureSidebar';

export default function Evaluators() {
  const handleEvaluatorSelect = (evaluatorId: string) => {
    console.log('Selected evaluator:', evaluatorId);
    // Handle evaluator selection, e.g., update configuration panel
  };

  return (
    <div className="flex h-full">
      <EvaluatorFeatureSidebar onSelectEvaluator={handleEvaluatorSelect} />
      
      {/* Configuration Panel */}
      <div className="flex-1 p-6 border-r border-gray-200 overflow-auto">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Evaluator configuration</h1>
        
        <InfoBanner />
        
        <div className="space-y-8">
          <ModelConfig />
          <InstructionInput />
          <EvaluationScale />
        </div>
      </div>

      {/* Playground Panel */}
      <div className="w-[400px] p-6 bg-white overflow-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Playground</h2>
        <Playground />
      </div>
    </div>
  );
}
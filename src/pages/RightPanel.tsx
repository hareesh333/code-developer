import React, { useState } from "react";
// Use ChevronsRight for the close button icon
import { ChevronRight, ChevronDown, Trash2, ChevronsRight } from "lucide-react";
// Adjust import path if your store file is elsewhere
import { Variable, PromptTool } from '../components/store/SinglePromptState'; // Or your correct path

interface RightPanelProps {
    // Added onClose prop
    onClose: () => void;
    isRightPanelOpen?: boolean; // Maybe redundant now
    // Config Section Props
    model: string; temperature: number; maxTokens: number; stop: string; topP: number; presencePenalty: number; frequencyPenalty: number; streaming: boolean; jsonMode: boolean; seed: number; toolChoice: string;
    setModel: (model: string) => void; setTemperature: (temp: number) => void; setMaxTokens: (tokens: number) => void; setStop: (stop: string) => void; setTopP: (topP: number) => void; setPresencePenalty: (penalty: number) => void; setFrequencyPenalty: (penalty: number) => void; setStreaming: (streaming: boolean) => void; setJsonMode: (jsonMode: boolean) => void; setSeed: (seed: number) => void; setToolChoice: (choice: string) => void;
    showConfigurationSection: boolean; setShowConfigurationSection: () => void; // Toggle function

    // Variable Section Props (Corrected signature)
    variables: Variable[];
    handleDeleteVariable: (keyToDelete: string) => void;
    handleVariableValueChange: (key: string, value: string) => void; // Expects key and value
    showVariablesSection: boolean; setShowVariablesSection: () => void; // Toggle function

    // Tool Section Props
    promptTools: PromptTool[]; handleDeletePromptTool: (toolToDelete: string) => void; handleAddPromptTool: (name: string) => void;
    showToolsSection: boolean; setShowToolsSection: () => void; // Toggle function

    showParametersPanel?: boolean; // Maybe redundant now
}


const RightPanel: React.FC<RightPanelProps> = ({
    onClose, // Destructure the new prop
    // Destructure other props...
    variables, handleDeleteVariable, handleVariableValueChange, showVariablesSection, setShowVariablesSection,
    promptTools, handleDeletePromptTool, handleAddPromptTool, showToolsSection, setShowToolsSection,
    showConfigurationSection, setShowConfigurationSection,
    isRightPanelOpen, showParametersPanel, model, temperature, maxTokens, stop, topP, presencePenalty, frequencyPenalty, streaming, jsonMode, seed, toolChoice, setModel, setTemperature, setMaxTokens, setStop, setTopP, setPresencePenalty, setFrequencyPenalty, setStreaming, setJsonMode, setSeed, setToolChoice,
}) => {

    const [newPromptTool, setNewPromptTool] = useState("");
    const onAddToolClick = () => {
        if (newPromptTool.trim() && !promptTools.some(t => t.name === newPromptTool.trim())) {
            handleAddPromptTool(newPromptTool.trim());
            setNewPromptTool("");
        } else {
             alert("Tool name cannot be empty or duplicate.");
        }
    };

    return (
        <div className="h-full flex flex-col bg-white text-gray-900"> {/* Light theme */}

            {/* Header Section */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-medium text-gray-800">Parameters</h2>
                <button
                    onClick={onClose} // Use the passed-in close handler
                    className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100"
                    title="Close Parameters"
                >
                    {/* Use ChevronsRight Icon */}
                    <ChevronsRight className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable content area - use flex-1 */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">

                {/* Configuration Section */}
                <div>
                    <div className="flex items-center justify-between cursor-pointer group mb-2" onClick={setShowConfigurationSection} >
                         <h3 className="font-semibold text-gray-700">Configuration</h3>
                         {showConfigurationSection ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                    </div>
                    {showConfigurationSection && (
                        <div className="mt-2 space-y-4 pl-2 border-l-2 border-gray-100">
                            {/* Config inputs... */}
                            <div><label htmlFor="model-right" className="block text-sm font-medium text-gray-600 font-sans mb-1">Model</label><select id="model-right" value={model} onChange={(e) => setModel(e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-sans px-3 py-1.5 focus:outline-none focus:ring-1 bg-gray-50" ><option value="gpt-4">gpt-4</option><option value="gpt-3.5-turbo">gpt-3.5-turbo</option></select></div>
                            <div><label htmlFor="temperature" className="block text-sm font-medium text-gray-600 font-sans mb-1">Temperature</label><input type="range" id="temperature" min="0" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/><p className="text-xs text-gray-500 mt-1 font-sans text-right">{temperature.toFixed(1)}</p></div>
                            <div><label htmlFor="max-tokens" className="block text-sm font-medium text-gray-600 font-sans mb-1">Max Tokens</label><input type="range" id="max-tokens" min="1" max={model.includes('gpt-4') ? 8192 : 4096} step="1" value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/><p className="text-xs text-gray-500 mt-1 font-sans text-right">{maxTokens}</p></div>
                            <div><label htmlFor="stop" className="block text-sm font-medium text-gray-600 font-sans mb-1">Stop Sequences</label><input type="text" id="stop" value={stop} onChange={(e) => setStop(e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-sans px-3 py-1.5 focus:outline-none focus:ring-1 bg-gray-50" placeholder="e.g., \n, END" /></div>
                            <div><label htmlFor="top-p" className="block text-sm font-medium text-gray-600 font-sans mb-1">Top P</label><input type="range" id="top-p" min="0" max="1" step="0.01" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/><p className="text-xs text-gray-500 mt-1 font-sans text-right">{topP.toFixed(2)}</p></div>
                            <div><label htmlFor="presence-penalty" className="block text-sm font-medium text-gray-600 font-sans mb-1">Presence Penalty</label><input type="range" id="presence-penalty" min="-2" max="2" step="0.1" value={presencePenalty} onChange={(e) => setPresencePenalty(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/><p className="text-xs text-gray-500 mt-1 font-sans text-right">{presencePenalty.toFixed(1)}</p></div>
                            <div><label htmlFor="frequency-penalty" className="block text-sm font-medium text-gray-600 font-sans mb-1">Frequency Penalty</label><input type="range" id="frequency-penalty" min="-2" max="2" step="0.1" value={frequencyPenalty} onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/><p className="text-xs text-gray-500 mt-1 font-sans text-right">{frequencyPenalty.toFixed(1)}</p></div>
                            <div className="pt-2"><label className="flex items-center gap-2 text-sm font-medium text-gray-600 font-sans cursor-pointer"><input type="checkbox" checked={streaming} onChange={(e) => setStreaming(e.target.checked)} className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"/> Streaming</label></div>
                            <div><label className="flex items-center gap-2 text-sm font-medium text-gray-600 font-sans cursor-pointer"><input type="checkbox" checked={jsonMode} onChange={(e) => setJsonMode(e.target.checked)} className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"/> JSON Mode</label></div>
                            <div><label htmlFor="seed" className="block text-sm font-medium text-gray-600 font-sans mb-1">Seed</label><input type="number" id="seed" value={seed} onChange={(e) => setSeed(parseInt(e.target.value, 10) || 0)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-sans px-3 py-1.5 focus:outline-none focus:ring-1 bg-gray-50"/><p className="text-xs text-gray-500 mt-1 font-sans">Use 0 for random seed.</p></div>
                            <div><label htmlFor="tool-choice" className="block text-sm font-medium text-gray-600 font-sans mb-1">Tool Choice</label><select id="tool-choice" value={toolChoice} onChange={(e) => setToolChoice(e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-sans px-3 py-1.5 focus:outline-none focus:ring-1 bg-gray-50"><option value="auto">auto</option><option value="none">none</option>{promptTools.map(tool => <option key={tool.name} value={tool.name}>{tool.name}</option>)}</select></div>
                        </div>
                    )}
                 </div>

                {/* Variables Section */}
                 <div>
                    <div className="flex items-center justify-between cursor-pointer group mb-2" onClick={setShowVariablesSection}>
                        <h3 className="font-semibold text-gray-800 font-sans">Variables</h3>
                        {showVariablesSection ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                    </div>
                    {showVariablesSection && (
                        <div className="mt-2 space-y-2 pl-2 border-l-2 border-gray-100">
                             <p className="text-xs text-gray-500 font-sans"> Variables detected from {'{{key}}'} in System Prompt. Edit values below. </p>
                             {variables.length === 0 && ( <p className="text-xs text-gray-400 font-sans italic">No variables detected.</p> )}
                             {variables.map((variable) => (
                                 <div key={variable.key} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2">
                                     <div className="flex-shrink-0 w-28"><label htmlFor={`var-key-${variable.key}`} className="block text-xs text-gray-500 font-sans mb-0">Key</label><input id={`var-key-${variable.key}`} type="text" readOnly value={variable.key} className="w-full border border-gray-300 rounded p-1 text-sm font-sans bg-gray-100 cursor-not-allowed" /></div>
                                     <div className="flex-1"><label htmlFor={`var-val-${variable.key}`} className="block text-xs text-gray-500 font-sans mb-0">Value</label><input id={`var-val-${variable.key}`} type="text" value={variable.value} onChange={(e) => handleVariableValueChange(variable.key, e.target.value)} className="w-full border border-gray-300 rounded p-1 text-sm font-sans focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" /></div>
                                     <button onClick={() => handleDeleteVariable(variable.key)} className="ml-1 p-1 text-gray-400 hover:text-red-600 rounded self-end mb-1" title="Delete Variable from System Prompt"> <Trash2 className="h-4 w-4" /> </button>
                                 </div>
                             ))}
                         </div>
                    )}
                </div>

                {/* Tools Section */}
                 <div>
                    <div className="flex items-center justify-between cursor-pointer group mb-2" onClick={setShowToolsSection}>
                        <h3 className="font-semibold text-gray-800 font-sans">Tools</h3>
                        {showToolsSection ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                    </div>
                    {showToolsSection && (
                        <div className="mt-2 space-y-2 pl-2 border-l-2 border-gray-100">
                            {promptTools.map((tool) => ( <div key={tool.name} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-2 font-sans"> <span className="text-sm font-medium text-gray-700">{tool.name}</span> <button onClick={() => handleDeletePromptTool(tool.name)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Delete Tool"> <Trash2 className="h-4 w-4" /> </button> </div> ))}
                            <div className="flex gap-2 pt-1"><input type="text" placeholder="New Tool Name" value={newPromptTool} onChange={(e) => setNewPromptTool(e.target.value)} className="flex-1 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-sans focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" /><button onClick={onAddToolClick} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs font-sans font-medium disabled:opacity-50 flex-shrink-0" disabled={!newPromptTool.trim()}> Add </button></div>
                        </div>
                    )}
                 </div>

            </div> {/* End Scrollable content area */}
        </div>
    );
};
export default RightPanel;
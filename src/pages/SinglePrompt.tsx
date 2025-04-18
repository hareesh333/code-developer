import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import {
  PlayCircle, Plus, Copy, Trash, ArrowLeft, RefreshCcw, X, Settings2, ChevronDown, Send, ChevronsRight,
  MessageSquarePlus,
  PlusCircle,
  // --- ADDED Icons for Header ---
  Save, UploadCloud, FlaskConical
} from 'lucide-react';

import useSinglePromptStore, { Message, Variable, PromptTool } from '../components/store/SinglePromptState'; // Adjust path

import RightPanel from '../pages/RightPanel'; // Adjust path

// --- Sub Components (Defined here) ---
const promptRoles: Record<Message["role"], string> = { system: "System", user: "User", assistant: "Assistant", tool: "Tool" };
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// RoleDropdown remains the same
const RoleDropdown = ({ role, onRoleChange }: { role: Message["role"], onRoleChange?: (role: Message["role"]) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const availableRoles = (Object.keys(promptRoles) as Array<keyof typeof promptRoles>);
    const selectableRoles = availableRoles.filter(r => r === 'system' || r === 'user');

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded text-sm"
                disabled={role !== 'system' && role !== 'user'} // Keep original logic
            >
                <div className="text-gray-700 font-medium">{promptRoles[role]}</div>
                {(role === 'system' || role === 'user') && (
                     <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>
            {isOpen && (role === 'system' || role === 'user') && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    {selectableRoles.map((key) => (
                        <button
                            key={key}
                            className="block w-full text-left px-3 py-1.5 hover:bg-gray-100 text-sm text-gray-700"
                            onClick={() => {
                                if (onRoleChange) onRoleChange(key);
                                setIsOpen(false);
                            }}
                        >
                            {promptRoles[key]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface MessageComponentProps {
    message: Message;
    onContentChange?: (id: string, content: string) => void;
    onRoleChange?: (id: string, role: Message["role"]) => void;
    isInputPanel?: boolean; // True if in the left input panel
    onDelete?: (id: string) => void;
    onCopy?: (content: string) => void;
}

// --- Modified MessageComponent --- (Original version from your code)
const MessageComponent = ({ message, onContentChange, onRoleChange, isInputPanel = false, onDelete, onCopy }: MessageComponentProps) => {
  const handleCopy = () => { navigator.clipboard.writeText(message.content).then(() => console.log("Copied")).catch(err => console.error("Copy failed:", err)); if (onCopy) onCopy(message.content); };
  const handleDelete = () => { if (onDelete) onDelete(message.id); };
  const isEditable = !!onContentChange && !!message.isEditing;

  const actionButtons = (
    <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      {!isInputPanel && message.role === 'assistant' && !isEditable && (
        <button title="Add to input (Placeholder)" className="p-1 text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4" />
        </button>
      )}
      {!isEditable && (
          <button title="Copy" onClick={handleCopy} className="p-1 text-gray-400 hover:text-gray-600">
              <Copy className="w-4 h-4" />
          </button>
      )}
      {onDelete && (
        <button title="Delete" onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-500">
            <Trash className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  let wrapperClasses = 'w-full mb-4 last:mb-0 group relative';
  let contentClasses = '';
  let roleTextClasses = 'text-sm';

  if (isInputPanel) {
    wrapperClasses += ' bg-white p-3 border border-gray-200 rounded-md shadow-sm';
    roleTextClasses += ' text-gray-700 font-medium';
    contentClasses = 'w-full mt-1 bg-white text-gray-800 border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[60px] block leading-snug text-sm';
  } else {
    roleTextClasses += ' text-gray-700 font-semibold';
    if (isEditable) {
        wrapperClasses += ' bg-white p-3 border-2 border-blue-500 rounded-md shadow-sm';
        roleTextClasses += ' text-blue-700';
        contentClasses = 'w-full mt-1 bg-white text-gray-800 border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[60px] block leading-snug text-sm';
    } else if (message.role === 'assistant') {
        wrapperClasses += ' border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-sm';
        contentClasses = 'text-gray-800';
    } else if (message.role === 'user') {
        wrapperClasses += ' bg-white px-3 pt-1 pb-2';
        contentClasses = 'text-gray-800';
    } else if (message.role === 'tool') {
        wrapperClasses += ' bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs mt-2 mb-2';
        contentClasses = 'text-yellow-800 font-mono';
        roleTextClasses = 'text-xs text-yellow-700 font-medium';
    }
  }
  return (
    <div className={wrapperClasses}>
      <div className="flex justify-between items-center mb-1 min-h-[2rem]">
        {isInputPanel && onRoleChange && (message.role === 'system' || message.role === 'user') ? (
          <RoleDropdown role={message.role} onRoleChange={role => onRoleChange(message.id, role)} />
        ) : (
          <div className={roleTextClasses}>{promptRoles[message.role]}</div>
        )}
        <div className={isInputPanel ? "absolute top-2 right-2" : "ml-auto"}>
             {actionButtons}
        </div>
      </div>
      {isEditable ? (
        <textarea
          className={contentClasses}
          value={message.content}
          onChange={(e) => onContentChange && onContentChange(message.id, e.target.value)}
          placeholder={`Enter ${promptRoles[message.role].toLowerCase()} query...`}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          rows={3}
          autoFocus // Maybe focus when added?
        />
      ) : (
        <div className={`mt-1 whitespace-pre-wrap break-words leading-relaxed text-sm ${contentClasses}`}>
          {message.content}
        </div>
      )}
    </div>
  );
};
// --- End MessageComponent ---

// --- Main Component ---
export default function SinglePrompt() {
  const [title] = useState("Playground");

  // Get state/actions from store (Original list)
  const {
    messages, addMessage, deleteMessage, updateMessageContent, updateMessageRole,
    conversationHistory, setConversationHistory, deleteFromHistory,
    modelConfig, setModelConfig, showConfigurationSection, toggleConfigurationSection,
    variables, deleteVariable, updateVariableValue, // Assuming addVariable is not in original store
    showVariablesSection, toggleVariablesSection,
    promptTools, addPromptTool, deletePromptTool, showToolsSection, toggleToolsSection,
    isRunning, setIsRunning,
  } = useSinglePromptStore();

  // Local state (Original)
  const [showSettings, setShowSettings] = useState(false);

  // Action Handlers (Original versions)
  const addUserTemplate = () => { addMessage({ id: generateId(), role: "user", content: "", isEditing: true }); };

  const handleRun = () => {
    setIsRunning(true);
    const lastHistoryMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;

    if (lastHistoryMessage && lastHistoryMessage.role === 'user' && lastHistoryMessage.isEditing) {
        console.log("Running Follow-up Prompt...");
        if (lastHistoryMessage.content.trim() === '') {
            alert("Please enter your follow-up query before running.");
            setIsRunning(false);
            return;
        }
        const historyForApi = conversationHistory.map((msg, index) =>
            index === conversationHistory.length - 1 ? { ...msg, isEditing: false } : msg
        );
        console.log("Sending history for follow-up:", historyForApi);
        console.log("Using config:", modelConfig);
        setTimeout(() => {
            const responseContent = `Simulated follow-up response to "${lastHistoryMessage.content.substring(0, 30)}...". Model: ${modelConfig.model}.`;
            const responseMessage: Message = { id: generateId(), role: "assistant", content: responseContent, isEditing: false };
            setConversationHistory([...historyForApi, responseMessage]);
            setIsRunning(false);
            console.log("Follow-up run simulation complete.");
        }, 1500);
    } else {
        console.log("Running Initial Prompt...");
        const messagesToRun = messages.filter(msg => (msg.role === 'system' || msg.role === 'user') && msg.content.trim() !== '');
        const systemPrompt = messagesToRun.find(m => m.role === 'system');
        if (!systemPrompt) { alert("A System prompt is required."); setIsRunning(false); return; }
        if (systemPrompt.content.trim() === '') { alert("System prompt content cannot be empty."); setIsRunning(false); return; }

        const variableMap = new Map(variables.map(v => [v.key, v.value]));
        const processedMessages = messagesToRun.map(msg => {
          let processedContent = msg.content;
          const keysInContent = msg.content.match(/\{\{\s*([^{}]+?)\s*\}\}/g) || [];
          keysInContent.forEach(placeholder => {
            const key = placeholder.replace(/\{\{\s*|\s*\}\}/g, '');
            const value = variableMap.get(key) || '';
            const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`\\{\\{\\s*${escapedKey}\\s*\\}\\}`, 'g');
            processedContent = processedContent.replace(regex, value);
          });
          return { ...msg, content: processedContent, isEditing: false };
        });
        console.log("Processed Input Messages:", processedMessages);
        console.log("Using config:", modelConfig);
        setTimeout(() => {
            const responseContent = `Simulated initial response using model ${modelConfig.model}. Temp: ${modelConfig.temperature}.`;
            const responseMessage: Message = { id: generateId(), role: "assistant", content: responseContent, isEditing: false };
            setConversationHistory([...processedMessages, responseMessage]);
            setIsRunning(false);
            console.log("Initial run simulation complete.");
        }, 1500);
    }
  };

  const handleAddEditableUserMessage = () => {
       const lastMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
       if (lastMessage && lastMessage.role === 'user' && lastMessage.isEditing) {
           console.log("Already adding a follow-up message.");
           return;
       }
      const newUserMessage: Message = { id: generateId(), role: 'user', content: '', isEditing: true };
      setConversationHistory([...conversationHistory, newUserMessage]);
  };

  const handleHistoryContentChange = useCallback((id: string, content: string) => {
      setConversationHistory(
          conversationHistory.map(msg =>
              msg.id === id ? { ...msg, content } : msg
          )
      );
  }, [conversationHistory, setConversationHistory]);

  // --- ADDED Placeholder handlers for new header buttons ---
  const handleSaveSession = () => {
      console.log("Save Session clicked");
      alert("Save Session functionality not implemented yet.");
  };

  const handlePublishVersion = () => {
      console.log("Publish Version clicked");
      alert("Publish Version functionality not implemented yet.");
  };

  const handleTest = () => {
      console.log("Test clicked");
      alert("Test functionality not implemented yet.");
  };
  // --- END Added handlers ---


  // --- MODIFIED Function to render the output panel content --- (Original version)
  const renderRightPanelContent = () => {
    const lastHistoryMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
    const showLoading = isRunning && !(lastHistoryMessage?.isEditing);

    if (showLoading && conversationHistory.length === 0) {
         return <div className="flex h-full items-center justify-center text-gray-600"><RefreshCcw className="w-5 h-5 animate-spin mr-2" />Running initial prompt...</div>;
    }

    if (!isRunning && conversationHistory.length === 0) {
      return (
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center text-gray-400 text-sm">
            <div className="mb-1">Configure your prompt in the left panel.</div>
            <div className="mb-3">Add variables like {'`{{variable_name}}`'} in the System Prompt.</div>
            <div className="mb-3">Click <span className="font-semibold">Run</span> to get the first response.</div>
          </div>
        </div>
      );
    }

    const displayHistory = conversationHistory.filter(msg => msg.role !== 'system');
    const showAddMessageButton = conversationHistory.length > 0 && !isRunning && !(lastHistoryMessage?.role === 'user' && lastHistoryMessage?.isEditing);

    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayHistory.map((message) => (
             <MessageComponent
                key={message.id}
                message={message}
                isInputPanel={false}
                onContentChange={message.isEditing ? handleHistoryContentChange : undefined}
                onDelete={deleteFromHistory}
                onCopy={() => {}}
            />
          ))}
          {showLoading && conversationHistory.length > 0 && (
                <div className="flex items-center justify-center text-gray-500 p-2 text-sm">
                    <RefreshCcw className="w-4 h-4 animate-spin mr-2" />
                    <span>Generating response...</span>
                </div>
           )}
        </div>
        <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
          {showAddMessageButton && (
              <button
                  onClick={handleAddEditableUserMessage}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md px-3 py-1.5 w-20 justify-center text-sm hover:bg-gray-100 transition-colors shadow-sm"
              >
                 <MessageSquarePlus className="w-4 h-4" /> Message
              </button>
          )}
            {lastHistoryMessage?.role === 'user' && lastHistoryMessage?.isEditing && !isRunning && (
                 <div className="text-center text-sm text-gray-500">
                     Enter your query above and click <span className="font-semibold">Run</span> in the footer.
                 </div>
            )}
        </div>
      </div>
    );
  };

  return (
    // --- Use original outer div ---
    <div className="h-full flex flex-col bg-gray-50 text-gray-900 overflow-hidden">

      {/* --- MODIFIED Header --- */}
      <header className="border-b border-gray-200 p-3 flex justify-between items-center flex-shrink-0 bg-white shadow-sm h-16"> {/* Added fixed height */}
         {/* Left Side: Title */}
         <div className="flex items-center gap-2"> {/* Wrap title for potential future additions */}
            <div className="text-gray-800 font-semibold text-lg">{title}</div>
            {/* Optional: Version Tag */}
            {/* <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
                vX
            </span> */}
         </div>

         {/* Right Side: Action Buttons */}
         <div className="flex items-center gap-2"> {/* Container for the buttons */}
            {/* Save Session Button */}
            <button
                onClick={handleSaveSession}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors shadow-sm"
                title="Save current session"
            >
                <Save className="w-4 h-4" />
                Save session
            </button>

            {/* Publish Version Button */}
            <button
                onClick={handlePublishVersion}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors shadow-sm"
                title="Publish this version"
            >
                <UploadCloud className="w-4 h-4" />
                Publish version
            </button>

            {/* Test Button */}
            <button
                onClick={handleTest}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors shadow-sm"
                title="Test this configuration"
            >
                <FlaskConical className="w-4 h-4" />
                Test
            </button>
         </div>
      </header>
      {/* --- End MODIFIED Header --- */}

      {/* Main Content Area (Original structure) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Panel (Original structure) */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <MessageComponent
                key={message.id}
                message={message}
                onContentChange={updateMessageContent}
                onRoleChange={updateMessageRole}
                isInputPanel={true}
                onDelete={messages.length > 1 ? deleteMessage : undefined}
                onCopy={() => {}}
              />
            ))}
            <div className="mt-4">
              {/* Original "Template" Button */}
              <button
                onClick={addUserTemplate}
                className="flex items-center gap-2 text-black-600 hover:text-gray-800 border-2 border border-black-700 rounded-xl px-3 py-2 w-30 justify-center text-sm hover:bg-indigo-500 transition-colors"
                >
                <PlusCircle className="w-4 h-4" /> Template
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Container (Original structure) */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
           {/* Output Panel */}
           <div className="flex-1 flex flex-col min-w-0">
               {renderRightPanelContent()}
           </div>

           {/* Settings Panel (Original structure) */}
           {showSettings && (
             <div className="w-80 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden shadow-lg">
                <RightPanel
                    onClose={() => setShowSettings(false)}
                    // Pass ONLY the props that were originally passed based on your store
                    model={modelConfig.model}
                    setModel={(model) => setModelConfig({ model })} // Assuming setModelConfig only needs model
                    temperature={modelConfig.temperature}
                    setTemperature={(temp) => setModelConfig({ temperature: temp })} // Assuming setModelConfig handles individual props
                    maxTokens={modelConfig.maxTokens}
                    setMaxTokens={(tokens) => setModelConfig({ maxTokens: tokens })}
                    stop={modelConfig.stop}
                    setStop={(stop) => setModelConfig({ stop })}
                    topP={modelConfig.topP}
                    setTopP={(topP) => setModelConfig({ topP })}
                    presencePenalty={modelConfig.presencePenalty}
                    setPresencePenalty={(penalty) => setModelConfig({ presencePenalty: penalty })}
                    frequencyPenalty={modelConfig.frequencyPenalty}
                    setFrequencyPenalty={(penalty) => setModelConfig({ frequencyPenalty: penalty })}
                    streaming={modelConfig.streaming}
                    setStreaming={(streaming) => setModelConfig({ streaming })}
                    jsonMode={modelConfig.jsonMode}
                    setJsonMode={(jsonMode) => setModelConfig({ jsonMode })}
                    seed={modelConfig.seed}
                    setSeed={(seed) => setModelConfig({ seed })}
                    toolChoice={modelConfig.toolChoice}
                    setToolChoice={(choice) => setModelConfig({ toolChoice: choice })}
                    showConfigurationSection={showConfigurationSection}
                    setShowConfigurationSection={toggleConfigurationSection} // Assuming toggle function exists
                    variables={variables}
                    handleDeleteVariable={deleteVariable}
                    handleVariableValueChange={updateVariableValue}
                    // Assuming addVariable handler is NOT passed in original code
                    showVariablesSection={showVariablesSection}
                    setShowVariablesSection={toggleVariablesSection} // Assuming toggle function exists
                    promptTools={promptTools}
                    handleDeletePromptTool={deletePromptTool}
                    handleAddPromptTool={(name) => addPromptTool({ name })} // Assuming addPromptTool exists
                    showToolsSection={showToolsSection}
                    setShowToolsSection={toggleToolsSection} // Assuming toggle function exists
                />
             </div>
            )}
        </div>
      </div>

      {/* Footer (Original structure) */}
      <footer className="border-t border-gray-200 p-3 flex justify-between items-center bg-white flex-shrink-0 shadow-sm">
         {/* Left side: Settings button and quick info */}
         <div className="flex items-center gap-4">
            <button
                title="Open Settings Panel"
                className={`p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${showSettings ? 'bg-gray-100 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setShowSettings(true)}
                disabled={showSettings}
            >
                <Settings2 className="w-5 h-5" />
            </button>
            <div className="text-xs hidden md:flex items-center gap-3 text-gray-500">
                <div className="flex items-baseline gap-1">
                    <span className="font-medium text-gray-400">Model:</span>
                    <span className="text-gray-600">{modelConfig.model}</span>
                </div>
                <div className="flex items-baseline gap-1">
                     <span className="font-medium text-gray-400">Temp:</span>
                    <span className="text-gray-600">{modelConfig.temperature.toFixed(1)}</span>
                </div>
            </div>
         </div>
         {/* Right side: Run button - NOW HANDLES BOTH INITIAL AND FOLLOW-UP */}
         <button
            onClick={handleRun} // Original handleRun
            disabled={isRunning}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm" // Original styling
         >
            {isRunning ? (
                <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>Running...</span>
                </>
            ) : (
                <>
                    <PlayCircle className="w-5 h-5" />
                    <span>Run</span>
                </>
            )}
         </button>
      </footer>
    </div>
  );
}
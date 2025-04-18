// src/components/store/SinglePromptState.tsx

import { create } from "zustand";

// --- Type Definitions ---

export type Message = {
  id: string;
  role: 'user' | 'system' | 'assistant' | 'tool';
  content: string;
  isEditing?: boolean;
};

// --- Updated Variable Type ---
export type Variable = {
  key: string; // The unique identifier/name used in {{key}}
  valueType: 'static' | 'contextSource'; // Type of value source
  value: string; // Holds the STATIC value if valueType is 'static'
  contextSourceId?: string; // Holds the ID of the linked ContextSource if valueType is 'contextSource'
};
// --- End Update ---

export type PromptTool = { name: string; }; // Simplified for now

export type ModelConfig = {
    model: string; temperature: number; maxTokens: number; stop: string; topP: number;
    presencePenalty: number; frequencyPenalty: number; streaming: boolean; jsonMode: boolean;
    seed: number; toolChoice: string;
};

// --- NEW ContextSource Type ---
export type ContextSource = {
    id: string; // Unique ID for the source
    name: string; // User-friendly name (e.g., "HR-IT RAG")
    apiUrl: string; // The endpoint URL
    // Optional: Add fields for headers, params, method (GET/POST), body template later if needed
    headers?: Record<string, string>;
    params?: Record<string, string>; // For URL query params
    // bodyTemplate?: string; // For POST requests, potentially with {{query}} placeholder
    // method?: 'GET' | 'POST';
};
// --- End NEW Type ---

// Item type (kept minimal, potentially for local save/load)
export type Item = {
    id: string; title: string; description?: string; template: Message[];
    conversation?: Message[]; modelConfig?: Partial<ModelConfig>;
    variables?: Variable[]; promptTools?: PromptTool[]; contextSources?: ContextSource[]; // Add context sources here if saving templates
};


// --- State Slice Types ---

type ConversationState = {
  messages: Message[];
  conversationHistory: Message[];
  addMessage: (message: Message) => void;
  deleteMessage: (id: string) => void;
  updateMessageContent: (id: string, content: string) => void;
  updateMessageRole: (id: string, role: Message["role"]) => void;
  setConversationHistory: (history: Message[]) => void;
  deleteFromHistory: (id: string) => void;
};
type ConfigState = {
  modelConfig: ModelConfig;
  setModelConfig: (config: Partial<ModelConfig>) => void;
  showConfigurationSection: boolean;
  toggleConfigurationSection: () => void;
};
// --- Updated VariableState Slice ---
type VariableState = {
  variables: Variable[];
  deleteVariable: (key: string) => void;
  updateVariableValue: (key: string, value: string) => void; // Updates static value
  setVariables: (variables: Variable[]) => void;
  updateVariableKeyAndMessages: (oldKey: string, newKey: string) => void;
  // --- Add new action signatures ---
  setVariableValueType: (key: string, valueType: Variable['valueType']) => void;
  setVariableContextSource: (key: string, contextSourceId?: string) => void; // Link/unlink context source
  // --- End Add ---
  showVariablesSection: boolean;
  toggleVariablesSection: () => void;
};
// --- End Update ---
type ToolState = {
  promptTools: PromptTool[];
  addPromptTool: (tool: PromptTool) => void;
  deletePromptTool: (toolName: string) => void;
  showToolsSection: boolean;
  toggleToolsSection: () => void;
};
// --- NEW ContextSourceState Slice ---
type ContextSourceState = {
    contextSources: ContextSource[];
    addContextSource: (sourceData: Omit<ContextSource, 'id'>) => string; // Returns the new ID
    updateContextSource: (updatedSource: ContextSource) => void;
    deleteContextSource: (id: string) => void;
    // You might add a toggle for showing a management section later
};
// --- End NEW Slice ---
type RunState = {
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
};
type ItemState = { // Kept minimal
    items: Item[];
    addItem: (item: Item) => void;
    removeItem: (id: string) => void;
    clearItems: () => void;
};


// --- Default Values & Helper Functions ---
const defaultModelConfigValues: ModelConfig = { /* ... same as before ... */
    model: "gpt-4", temperature: 0.7, maxTokens: 4096, stop: "", topP: 1.0,
    presencePenalty: 0, frequencyPenalty: 0, streaming: false,
    jsonMode: false, seed: 0, toolChoice: "auto",
};
const generateId = (prefix: string = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const variableRegex = /\{\{(.*?)\}\}/g;
const extractVariableKeys = (text: string): string[] => { /* ... same implementation ... */
    const matches = text.matchAll(variableRegex);
    const keys = new Set<string>();
    for (const match of matches) { const key = match[1]?.trim(); if (key) keys.add(key); }
    return Array.from(keys);
};
function escapeRegex(string: string): string { /* ... same implementation ... */
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
// --- Update Initial Message/Variables to include valueType ---
const initialSystemMessageContent = "You are a helpful assistant. Respond to the user based on {{topic}} and context: {{context}}. Consider the audience: {{audience}}.";
const createDefaultSystemMessage = (): Message => ({
    id: generateId('msg'), role: "system", content: initialSystemMessageContent, isEditing: true
});
// Derive default variables with valueType: 'static'
const defaultVariables = extractVariableKeys(initialSystemMessageContent).map(key => ({
    key,
    valueType: 'static', // Default to static
    value: '',           // Default empty static value
    contextSourceId: undefined // No context source initially
} as Variable)); // Type assertion for clarity
// --- End Update ---
// --- Combined Zustand Store Definition ---
type SinglePromptStoreState = ConversationState
                            & ConfigState
                            & VariableState
                            & ToolState
                            & ContextSourceState // Add the new slice
                            & RunState
                            & ItemState;

// Create the Zustand store
const useSinglePromptStore = create<SinglePromptStoreState>(
    // No longer using Immer for this example, but you could add it back
    (set, get) => ({

    // --- ConversationState Implementation --- (No changes needed here for context sources)
    messages: [createDefaultSystemMessage()],
    conversationHistory: [],
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    deleteMessage: (id) => set((state) => ({ messages: state.messages.filter((msg) => msg.id !== id) })),
    updateMessageContent: (id, content) => {
        const currentMessages = get().messages;
        const currentVariables = get().variables;
        let newVariables = [...currentVariables]; // Clone current variables
        const updatedMessages = currentMessages.map((msg) => msg.id === id ? { ...msg, content } : msg);
        const updatedMessage = updatedMessages.find(msg => msg.id === id);
        if (updatedMessage && updatedMessage.role === 'system') {
            const extractedKeys = extractVariableKeys(content);
            const currentVarMap = new Map(currentVariables.map(v => [v.key, v])); // Map existing variable objects
            newVariables = extractedKeys.map(key => {
                const existingVar = currentVarMap.get(key);
                // If key exists, keep its config; otherwise, create new default static variable
                return existingVar || { key, valueType: 'static', value: '', contextSourceId: undefined };
            });
        }
        set({ messages: updatedMessages, variables: newVariables });
    },
    updateMessageRole: (id, role) => set((state) => ({ messages: state.messages.map((msg) => msg.id === id ? { ...msg, role } : msg ) })),
    setConversationHistory: (history) => set({ conversationHistory: history }),
    deleteFromHistory: (id) => set((state) => ({ conversationHistory: state.conversationHistory.filter((msg) => msg.id !== id) })),

    // --- ConfigState Implementation --- (No changes)
    modelConfig: { ...defaultModelConfigValues },
    setModelConfig: (configUpdate) => set((state) => ({ modelConfig: { ...state.modelConfig, ...configUpdate } })),
    showConfigurationSection: true,
    toggleConfigurationSection: () => set((state) => ({ showConfigurationSection: !state.showConfigurationSection })),

    // --- VariableState Implementation ---
    variables: [...defaultVariables],
    deleteVariable: (keyToDelete) => { /* ... same implementation as before ... */
        const currentMessages = get().messages;
        let messagesNeedUpdate = false;
        const updatedMessages = currentMessages.map(msg => {
            if (msg.role === 'system') {
                const escapedKey = escapeRegex(keyToDelete);
                const variablePlaceholderRegex = new RegExp(`\\{\\{\\s*${escapedKey}\\s*\\}\\}`, 'g');
                if (variablePlaceholderRegex.test(msg.content)) {
                    messagesNeedUpdate = true;
                    return { ...msg, content: msg.content.replace(variablePlaceholderRegex, '') };
                }
            } return msg;
        });
        const updatedVariables = get().variables.filter(v => v.key !== keyToDelete);
        if (messagesNeedUpdate || updatedVariables.length !== get().variables.length) {
            set({ messages: updatedMessages, variables: updatedVariables });
        } else { console.warn(`Variable key "${keyToDelete}" or its placeholder not found.`); }
    },
    updateVariableValue: (key, value) => set((state) => ({
        variables: state.variables.map((v) =>
            v.key === key ? { ...v, value } : v // Only updates the static 'value' field
        )
    })),
    setVariables: (variables) => set({ variables }),
    updateVariableKeyAndMessages: (oldKey, newKey) => { /* ... same implementation as before ... */
        const trimmedNewKey = newKey.trim();
        if (!trimmedNewKey || trimmedNewKey === oldKey) { console.warn("Key update cancelled."); return; }
        const existingVariable = get().variables.find(v => v.key === trimmedNewKey);
        if (existingVariable && existingVariable.key !== oldKey) { alert(`Key "${trimmedNewKey}" already exists.`); return; }
        if (trimmedNewKey.includes('{') || trimmedNewKey.includes('}')) { alert(`Key cannot contain '{' or '}'.`); return; }
        set((state) => {
            const updatedVariables = state.variables.map(variable => variable.key === oldKey ? { ...variable, key: trimmedNewKey } : variable);
            const escapedOldKey = escapeRegex(oldKey);
            const oldKeyRegex = new RegExp(`\\{\\{\\s*${escapedOldKey}\\s*\\}\\}`, 'g');
            const newPlaceholder = `{{${trimmedNewKey}}}`;
            let messagesUpdated = false;
            const updatedMessages = state.messages.map(message => {
                if (message.role === 'system') {
                    const newContent = message.content.replace(oldKeyRegex, newPlaceholder);
                    if (newContent !== message.content) { messagesUpdated = true; return { ...message, content: newContent }; }
                } return message;
            });
            if (messagesUpdated || JSON.stringify(updatedVariables) !== JSON.stringify(state.variables)) {
                 return { variables: updatedVariables, messages: updatedMessages };
            } else { console.warn(`Key '${oldKey}' or placeholder not found.`); return {}; }
        });
    },
    // --- Implement new Variable actions ---
    setVariableValueType: (key, valueType) => set((state) => ({
        variables: state.variables.map(v => {
            if (v.key === key) {
                // When changing type, potentially reset the other value field
                return {
                    ...v,
                    valueType: valueType,
                    // If switching to static, clear contextSourceId. Keep static value? Yes.
                    // If switching to contextSource, clear static value? Optional, let's clear it. Clear contextSourceId until selected.
                    value: valueType === 'contextSource' ? '' : v.value, // Clear static value if switching to context
                    contextSourceId: valueType === 'static' ? undefined : undefined // Clear context ID when switching type
                };
            }
            return v;
        })
    })),
    setVariableContextSource: (key, contextSourceId) => set((state) => ({
        variables: state.variables.map(v => {
            // Ensure this only applies if the type is 'contextSource' and the key matches
            if (v.key === key && v.valueType === 'contextSource') {
                return { ...v, contextSourceId: contextSourceId };
            }
            return v;
        })
    })),
    // --- End Implement ---
    showVariablesSection: true,
    toggleVariablesSection: () => set((state) => ({ showVariablesSection: !state.showVariablesSection })),

    // --- ToolState Implementation --- (No changes needed here)
    promptTools: [],
    addPromptTool: (tool) => set((state) => {
        const trimmedName = tool.name?.trim(); if (!trimmedName) { console.warn("Empty tool name."); return {}; }
        if (state.promptTools.some(t => t.name === trimmedName)) { console.warn(`Tool "${trimmedName}" exists.`); return {}; }
        return { promptTools: [...state.promptTools, { name: trimmedName }] };
    }),
    deletePromptTool: (toolName) => set((state) => {
        const updatedTools = state.promptTools.filter((tool) => tool.name !== toolName);
        const updatedConfig = state.modelConfig.toolChoice === toolName ? { ...state.modelConfig, toolChoice: 'auto' } : state.modelConfig;
        return { promptTools: updatedTools, modelConfig: updatedConfig };
    }),
    showToolsSection: true,
    toggleToolsSection: () => set((state) => ({ showToolsSection: !state.showToolsSection })),

    // --- ContextSourceState Implementation ---
    contextSources: [], // Start with empty array
    addContextSource: (sourceData) => {
        const newId = generateId('ctx');
        const newSource: ContextSource = { ...sourceData, id: newId };
        set((state) => ({
            contextSources: [...state.contextSources, newSource]
        }));
        console.log("Added context source:", newSource);
        return newId; // Return the generated ID
    },
    updateContextSource: (updatedSource) => set((state) => ({
        contextSources: state.contextSources.map(cs =>
            cs.id === updatedSource.id ? { ...cs, ...updatedSource } : cs // Ensure ID is not overwritten if partial update
        )
    })),
    deleteContextSource: (id) => set((state) => ({
        contextSources: state.contextSources.filter(cs => cs.id !== id),
        // Also unlink this source from any variables using it
        variables: state.variables.map(v =>
            v.contextSourceId === id ? { ...v, contextSourceId: undefined, valueType: 'static', value: '' } : v // Revert variable to static if its source is deleted
        )
    })),
    // --- End ContextSource Implementation ---

    // --- RunState Implementation --- (No changes)
    isRunning: false,
    setIsRunning: (running) => set({ isRunning: running }),

    // --- ItemState Implementation --- (No changes)
    items: [],
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    clearItems: () => set({ items: [] }),

}));

export default useSinglePromptStore;
// Export types if needed elsewhere

import { create } from "zustand";
import { v4 as uuid } from "uuid";

// ====== Types ======
export type Role = 'user' | 'system' | 'assistant';

export type Message = {
  id: string;
  role: Role;
  content: string;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  template: Message[];
  conversation: Message[];
  result: Message | null;
  isRunning: boolean;
};

// ====== Store Interface ======
type SinglePromptStore = {
  items: Item[];

  // Item management
  addItem: (name: string, description: string) => void;
  removeItem: (itemId: string) => void;

  // Template
  addMessageToTemplate: (itemId: string, message: Message) => void;
  deleteTemplateMessage: (itemId: string, messageId: string) => void;
  getTemplateForItem: (itemId: string) => Message[];

  // Conversation
  addMessageToConversation: (itemId: string, message: Message) => void;
  deleteConversationMessage: (itemId: string, messageId: string) => void;
  resetConversationForItem: (itemId: string) => void;
  getConversationForItem: (itemId: string) => Message[];

  // Result
  runPromptForItem: (itemId: string) => Promise<void>;
  getResultForItem: (itemId: string) => Message | null;
};

const useSinglePromptStore = create<SinglePromptStore>((set, get) => ({
  items: [],

  // Create new prompt item
  addItem: (name, description) => {
    const defaultSystemMessage: Message = {
      id: "-1",
      role: "system",
      content: "Enter your system message",
    };

    const newItem: Item = {
      id: uuid(),
      name,
      description,
      template: [defaultSystemMessage],
      conversation: [],
      result: null,
      isRunning: false,
    };

    set((state) => ({ items: [...state.items, newItem] }));
  },

  // Delete prompt item
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  // Add message to template
  addMessageToTemplate: (itemId, message) => {
    if (!message.content.trim()) return;

    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, template: [...item.template, message] }
          : item
      ),
    }));
  },

  // Delete message from template
  deleteTemplateMessage: (itemId, messageId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              template: item.template.filter((msg) => msg.id !== messageId),
            }
          : item
      ),
    }));
  },

  // Get template
  getTemplateForItem: (itemId) => {
    return get().items.find((item) => item.id === itemId)?.template || [];
  },

  // Add message to conversation
  addMessageToConversation: (itemId, message) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, conversation: [...item.conversation, message] }
          : item
      ),
    }));
  },

  // Delete message from conversation
  deleteConversationMessage: (itemId, messageId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              conversation: item.conversation.filter((msg) => msg.id !== messageId),
            }
          : item
      ),
    }));
  },

  // Clear conversation
  resetConversationForItem: (itemId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, conversation: [] } : item
      ),
    }));
  },

  // Get conversation
  getConversationForItem: (itemId) => {
    return get().items.find((item) => item.id === itemId)?.conversation || [];
  },

  // Simulated LLM response
  runPromptForItem: async (itemId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, isRunning: true } : item
      ),
    }));

    const item = get().items.find((item) => item.id === itemId);
    if (!item) return;

    const inputText = item.conversation.map((m) => `${m.role}: ${m.content}`).join("\n");

    const assistantMessage: Message = {
      id: uuid(),
      role: "assistant",
      content: `Echoed response:\n${inputText}`,
    };

    await new Promise((res) => setTimeout(res, 500)); // Simulated delay

    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId
          ? {
              ...i,
              result: assistantMessage,
              isRunning: false,
              conversation: [...i.conversation, assistantMessage],
            }
          : i
      ),
    }));
  },

  // Get latest result
  getResultForItem: (itemId) => {
    return get().items.find((item) => item.id === itemId)?.result || null;
  },
}));

export default useSinglePromptStore;
 
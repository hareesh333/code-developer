import { Folder, Terminal, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import FeaturedNavbar from "../components/shared/FeaturedNavbar";
import InitPopup from "../components/shared/initpopup";
import { FolderType, useFilesManageStore } from "../components/store/FilesManage";

export const PromptTypes = [
  { id: "single", label: "Single Prompt" },
  { id: "comparison", label: "Comparison Prompt" },
  { id: "chain", label: "Chain Prompting" },
];

const objectTypes = [
  { icon: Terminal, label: "Prompt", type: "item" },
  { icon: Folder, label: "Folder", type: "folder" },
];

export default function Prompts() {
  const [activeTab, setActiveTab] = useState("single");
  const [showPopup, setShowPopup] = useState(false);
  const { itemid } = useParams(); // if present, we're in /prompts/:itemid
  const [popupType, setPopupType] = useState<"item" | "folder">("item");

  const addFolder = useFilesManageStore((state) => state.addFolder);
  const addItem = useFilesManageStore((state) => state.addItem);

  const handleCreatePrompt = (data: {
    name: string;
    description: string;
    type: string;
    folder: string;
  }) => {
    console.log("Creating prompt with:", data);
  };

  return (
    <div className="flex h-full">
      {/* ✅ Always visible */}
      <FeaturedNavbar objectTypes={objectTypes} />

      <main className="flex-1 flex flex-col ">
        {/* If viewing a specific prompt (via /prompts/:itemid), show it */}
        {itemid ? (
          <Outlet /> // Renders <SinglePrompt /> or others
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-800">Prompts Experiment</h1>
              <p className="text-gray-600 mt-2">
                Create and manage different types of prompts
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex justify-center">
              <div className="flex space-x-8">
                {PromptTypes.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-primary text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 flex justify-center items-center overflow-hidden">
              {activeTab === "single" && (
                <PromptCard
                  title="Single Prompt"
                  desc="Create individual prompts for specific tasks or questions. Perfect for straightforward interactions."
                  iconColor="text-primary"
                  onClick={() => setShowPopup(true)}
                />
              )}
              {activeTab === "comparison" && (
                <PromptCard
                  title="Comparison Prompt"
                  desc="Compare responses from different prompt variations to find the most effective approach."
                  iconColor="text-green-500"
                  comparison
                  onClick={() => setShowPopup(true)}
                />
              )}
              {activeTab === "chain" && (
                <PromptCard
                  title="Chain Prompting"
                  desc="Create a sequence of connected prompts where each output becomes the input for the next step."
                  iconColor="text-primary"
                  chain
                  onClick={() => setShowPopup(true)}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Create Prompt Popup */}
      <InitPopup
        title="Create a new Prompt"
        selectorObj={PromptTypes.map((tab) => ({
          value: tab.id,
          label: tab.label,
        }))}
        show={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={({ name, description, type, folder, category }) => {
          if (popupType === "folder") {
            addFolder(name, category as FolderType);
          } else {
            addItem(folder, name, description, type);
          }
        }}
      />
    </div>
  );
}


// Small UI card abstraction for cleaner JSX
function PromptCard({
  title,
  desc,
  iconColor,
  comparison,
  chain,
  onClick,
}: {
  title: string;
  desc: string;
  iconColor: string;
  comparison?: boolean;
  chain?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="text-center max-w-md">
      <div className="flex justify-center items-center mb-4">
        {chain ? (
          <>
            <Terminal className={`w-8 h-8 ${iconColor}`} />
            <ArrowRight className="w-4 h-4 text-gray-400 mx-1" />
            <Terminal className={`w-8 h-8 ${iconColor}`} />
            <ArrowRight className="w-4 h-4 text-gray-400 mx-1" />
            <Terminal className={`w-8 h-8 ${iconColor}`} />
          </>
        ) : comparison ? (
          <>
            <Terminal className={`w-10 h-10 ${iconColor} mr-2`} />
            <ArrowRight className="w-5 h-5 text-gray-400 mx-1" />
            <Terminal className="w-10 h-10 text-green-500 ml-2" />
          </>
        ) : (
          <Terminal className={`w-12 h-12 mx-auto ${iconColor}`} />
        )}
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{desc}</p>
      <button
        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
        onClick={onClick}
      >
        <Plus className="w-4 h-4" />
        <span>Create</span>
      </button>
    </div>
  );
}

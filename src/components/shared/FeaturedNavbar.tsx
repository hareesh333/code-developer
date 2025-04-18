import {
  PanelLeft,
  Plus,
  Terminal,
  Folder,
  Video,
  Database,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFilesManageStore, FolderType } from "../store/FilesManage";
import InitPopup from "./initpopup";
import { titleCase } from "title-case";
import { PromptTypes } from "../../pages/Prompts";
import FolderCard from "./FolderCardDetails";


// 👇 Main Component
export default function FeaturedNavbar({
  initialExpanded = true,
  objectTypes = [
    { icon: Terminal, label: "Prompt", type: "item" },
    { icon: Folder, label: "Folder", type: "folder" },
    { icon: Video, label: "Video", type: "" },
    { icon: Database, label: "Database", type: "" },
  ],
}) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const routeTitle = titleCase(lastSegment);

  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showPopup, setShowPopup] = useState(false);
  const [showInitPopup, setShowInitPopup] = useState(false);
  const [popupType, setPopupType] = useState<"item" | "folder">("item");
  const [title, setTitle] = useState(routeTitle);

  const addFolder = useFilesManageStore((state) => state.addFolder);
  const addItem = useFilesManageStore((state) => state.addItem);
  const removeItem = useFilesManageStore((state) => state.removeItem);
  const removeFolder = useFilesManageStore((state) => state.removeFolder);
  const folders = useFilesManageStore((state) => state.folders);
  const loadFromLocalStorage = useFilesManageStore((state) => state.loadFromLocalStorage);

  const selectorObj = useMemo(() => {
    return location.pathname.includes("prompts")
      ? PromptTypes.map((tab) => ({
          value: tab.label,
          label: tab.label,
        }))
      : undefined;
  }, [lastSegment]);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const handleCreate = (type: string) => {
    const lowerType = type.toLowerCase();

    if (lowerType === "folder") {
      setPopupType("folder");
      setTitle("Create a New Folder");
      setShowInitPopup(true);
    } else if (lowerType === "item") {
      setPopupType("item");
      setTitle(`Create a New ${routeTitle}`);
      setShowInitPopup(true);
    } else {
      alert("Still under development");
    }
  };

  return (
    <section
      className={`transition-all duration-300 ease-in-out ${
        isExpanded ? "w-80 border-r border-gray-200" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-hoverBg transition-colors rounded-md p-2"
        >
          <PanelLeft className="w-5 h-5 text-textSecondary" />
        </button>

        {isExpanded && (
          <input
            type="search"
            placeholder="Search"
            className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:primary focus:border-primary"
          />
        )}

        {isExpanded && (
          <div className="relative">
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="flex items-center text-textPrimary hover:bg-hoverBg transition-colors rounded-md p-2"
            >
              <Plus className="w-5 h-5 text-textSecondary" />
            </button>

            {showPopup && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setShowPopup(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {objectTypes.map((type) => (
                    <button
                      key={type.label}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        handleCreate(type.type);
                        setShowPopup(false);
                      }}
                    >
                      <type.icon className="w-4 h-4" />
                      <span>New {type.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <InitPopup
        title={title}
        show={showInitPopup}
        type={popupType}
        selectorObj={selectorObj}
        onClose={() => setShowInitPopup(false)}
        onSubmit={({ name, description, type, folder, category }) => {
          if (popupType === "folder") {
            addFolder(name, category as FolderType);
          } else {
            addItem(folder, name, description, type);
          }
        }}
      />

      {isExpanded && (
      <div className="px-4 py-2 space-y-4">
      {folders.map((folder) => (
        <FolderCard
          key={folder.folderid}
          folder={folder}
          onRemoveFolder={removeFolder}
          onRemoveItem={removeItem}
          location = {location.pathname}
        />
      ))}
    </div>
      )}

    </section>
  );
}
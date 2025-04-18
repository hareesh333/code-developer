import { X, Folder, Terminal } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {FolderType} from "../store/FilesManage";

type PopupType = "item" | "folder";
type SelectorOption = { value: string; label: string };

export default function InitPopup({
  show,
  title,
  type = "item",
  onClose,
  onSubmit,
  selectorObj,
}: {
  show: boolean;
  title: string;
  type?: PopupType;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    type: string;
    folder: string;
    category?: FolderType
  }) => void;
  selectorObj?: SelectorOption[];
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState(
    selectorObj?.[0]?.value || ""
  );
  const [folderPath, setFolderPath] = useState("");

  const location = useLocation()
  const category = location.pathname.split("/").slice(-1)[0];
  

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    onSubmit(
      type === "folder"
        ? {
            name,
            description: "",
            type: "folder",
            folder: selectedType || "",
            category: category as FolderType
          }
        : {
            name,
            description,
            type: selectedType || "",
            folder: folderPath,
          }
    );

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === "folder" ? "Folder Name" : "Name"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Description for items only */}
            {type === "item" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
            )}

            {/* Dropdown selector (optional) */}
            {selectorObj && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {type === "folder" ? "Category" : "Type"}
                </label>
                <div className="relative">
                  <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {selectorObj.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Folder path input (for items only) */}
            {type === "item" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Folder Location (optional)
                  <div className="relative mt-1">
                    <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={folderPath}
                      onChange={(e) => setFolderPath(e.target.value)}
                      placeholder="Select folder..."
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </label>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>{title}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
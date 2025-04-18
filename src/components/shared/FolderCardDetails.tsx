import { useState } from "react";
import {
  Trash2,
  ChevronRight,
  ChevronDown,
  FileText,
  MoreHorizontal,
  Folder as FolderClosed,
  FolderOpen,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ import
import { FolderType } from "../store/FilesManage";

import useSinglePromptStore,{Item} from "../store/SinglePromptState";



export default function FolderCard({
  folder,
  onRemoveFolder,
  onRemoveItem,
  location 
}: {
  folder: {
    folderid: string;
    name: string;
    category?: FolderType;
    items: {
      itemid: string;
      name: string;
      description: string;
      type: string;
      folderid: string;
    }[];
  };
  onRemoveFolder: (folderId: string) => void;
  onRemoveItem: (itemId: string) => void;
  location?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // ✅ hook for navigation
  const baseUrl = useLocation();
  const addItem = useSinglePromptStore((state) => state.addItem);


  const currentPath = location?.toLowerCase() ?? "";
  const folderCategory = folder.category?.toLowerCase() ?? "";

  if (!currentPath.includes(folderCategory)) {
    return null;
  }

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleRemoveFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveFolder(folder.folderid);
    setShowMenu(false);
  };

  const handleItemClick = (item: Item) => {
    
    const basePath = baseUrl.pathname.split("/prompts")[0]
    addItem({
      id: item.id,
      title: item.title,
      description: item.description,
      template: []
    });
    // ✅ Navigate to a dynamic route, adjust this based on your route structure
    navigate(`${basePath}/prompts/${item.id}`);
    
  };

  return (
    <div className="w-full">
      <div 
        className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 ${isOpen ? 'bg-gray-200' : ''}`}
        onClick={toggleFolder}
      >
        <div className="flex items-center space-x-3">
          {isOpen ? (
            <>
              <ChevronDown className="w-4 h-4 text-gray-600" />
              <FolderOpen className="w-5 h-5 text-blue-600" />
            </>
          ) : (
            <>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <FolderClosed className="w-5 h-5 text-gray-500" />
            </>
          )}
          <span className="font-medium text-sm text-gray-800">{folder.name}</span>
        </div>
        <div className="relative">
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
            onClick={toggleMenu}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 z-10 bg-white border shadow-md rounded-md py-1 w-32">
              <button
                className="flex items-center px-3 py-1 text-xs text-red-500 hover:bg-gray-100 w-full text-left"
                onClick={handleRemoveFolder}
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete Folder
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && folder.items.length > 0 && (
        <div className="bg-gray-50">
          {folder.items.map((item) => (
            <div
              key={item.itemid}
              className="flex justify-between items-center py-3 px-4 border-b border-gray-100 last:border-0 ml-6 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleItemClick({
                id: item.itemid, title: item.name, description: item.description,
                template: []
              })} // ✅ item click handler
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-gray-500 mr-3" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-500 uppercase">{item.type}</span>
                </div>
              </div>
              <button
                className="text-red-400 hover:bg-red-50 p-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.itemid);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && folder.items.length === 0 && (
        <div className="py-3 px-4 ml-6 text-xs text-gray-400">
          No items
        </div>
      )}  
    </div>
  );
}
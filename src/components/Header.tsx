import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  organization: string;
  workspace: string;
  username: string;
}

export default function Header({ organization, workspace, username }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 bg-headerBg border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-textPrimary font-medium">{organization}</span>
          <ChevronDown className="w-4 h-4 text-textSecondary" />
          <span className="text-textSecondary">/</span>
          <span className="text-textPrimary font-medium">{workspace}</span>
          <ChevronDown className="w-4 h-4 text-textSecondary" />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
              {username.charAt(0).toUpperCase()}
            </div>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
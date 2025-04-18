import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  FileText,
  GitBranch,
  Play,
  List,
  BarChart2,
  CheckSquare,
  Database,
  Link,
  Bell,
  HelpCircle,
  Book,
  Settings,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', path: 'home', section: null },
  { icon: FileText, label: 'Prompts', path: 'prompts', section: 'EVALUATE' },
  { icon: GitBranch, label: 'Workflows', path: 'workflows', section: 'EVALUATE' },
  { icon: Play, label: 'Runs', path: 'runs', section: 'EVALUATE' },
  { icon: List, label: 'Logs', path: 'logs', section: 'OBSERVE' },
  { icon: BarChart2, label: 'Dashboards', path: 'dashboards', section: 'ANALYZE' },
  { icon: CheckSquare, label: 'Evaluators', path: 'evaluators', section: 'LIBRARY' },
  { icon: Database, label: 'Datasets', path: 'datasets', section: 'LIBRARY' },
  { icon: Link, label: 'Context sources', path: 'context-sources', section: 'LIBRARY' },
  { icon: Bell, label: "What's new", path: 'whats-new', section: null },
  { icon: HelpCircle, label: 'Support', path: 'support', section: null },
  { icon: Settings, label: 'Settings', path: 'settings', section: null },
];

interface NavigationSidebarProps {
  accountId?: string;
}

export default function NavigationSidebar({ accountId }: NavigationSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(`/workspace/${accountId}/${path}`);
  };
  
  return (
    <nav
      className={` bg-sidebarBg  transition-width duration-200 ease-in-out h-full ${
        isExpanded ? 'w-48' : 'w-16 '
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="pt-6">
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.section && (
              <div className={`px-4 py-2 text-xs text-textSecondary ${!isExpanded && 'hidden'}`}>
                {item.section}
              </div>
            )}
            <button
              onClick={() => handleNavigation(item.path)}
              className="flex items-center w-full px-4 py-2 text-textPrimary hover:bg-hoverBg transition-colors"
            >
              <item.icon className="w-5 h-5 min-w-[1.25rem]" />
              {isExpanded && <span className="ml-3">{item.label}</span>}
            </button>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
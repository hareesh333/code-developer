import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from './Header';
import NavigationSidebar from './NavigationSidebar';

export default function Layout() {
  const { accountId } = useParams();

  return (
    <div className="flex bg-sidebarBg h-screen">
      <NavigationSidebar accountId={accountId} />
      
      <main className="flex flex-col flex-1 bg-white m-3 border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <Header
          organization="Groove Innovations"
          workspace="My Workspace"
          username="John"
        />
        <Outlet />
      </main>
    </div>
  );
}
import React from 'react';
import { useParams } from 'react-router-dom';
import FeatureNavbar from '../components/shared/FeaturedNavbar';

export default function Home() {
  const { accountId } = useParams();

  return (
    <section className="flex h-screen">
    <FeatureNavbar initialExpanded={false}/>
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Home</h1>
      <p className="text-gray-600">Welcome to workspace: {accountId}</p>
    </div>    
    </ section>
  );
}
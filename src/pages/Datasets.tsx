import React from 'react';
import { useParams } from 'react-router-dom';
import FeatureSidebar from '../components/FeatureSidebar';
import EmptyState from '../components/EmptyState';

const sampleFeatureItems = [
  { label: 'All Datasets', count: 0 },
  { label: 'Recently Added' },
  { label: 'Favorites' },
  { label: 'Shared with me' },
];

export default function Datasets() {
  const { accountId } = useParams();

  return (
    <div className="flex flex-1 overflow-hidden">
      <FeatureSidebar title="Datasets" items={sampleFeatureItems} />
      <main className="flex-1 overflow-auto bg-white p-6">
        <EmptyState />
      </main>
    </div>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/Home';
import Datasets from './pages/Datasets';
import Evaluators from './pages/Evaluators';
import Prompts from './pages/Prompts';
import SinglePrompt from './pages/SinglePrompt';


const account_id = "cm8tpfvrp06byeeyn5xbo1tgp";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to the specific workspace using account_id */}
        <Route 
          path="/" 
          element={<Navigate to={`/workspace/${account_id}/home`} replace />} 
        />
        
        {/* Workspace routes */}
        <Route path="/workspace/:accountId" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="evaluators" element={<Evaluators />} />
          
          <Route path="prompts" element={<Prompts /> }>
            <Route path=":itemid" element={<SinglePrompt />} />
          </Route>

          {/* Redirect /workspace/:accountId to home */}
          <Route index element={<Navigate to="home" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

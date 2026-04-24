import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import NodePalette from './components/Sidebar/NodePalette';
import WorkflowCanvas from './components/Canvas/WorkflowCanvas';
import PropertyPanel from './components/PropertyPanel/PropertyPanel';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <Header />
        <div className="app-layout">
          <NodePalette />
          <WorkflowCanvas />
          <PropertyPanel />
        </div>
      </ReactFlowProvider>
    </ThemeProvider>
  );
};

export default App;

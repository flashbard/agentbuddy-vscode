import React from 'react';
import ReactFlow, { Background, MiniMap, Panel, Controls, ReactFlowProvider } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { useStore } from './store';
import Agent from './nodes/Agent';

import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import"./index.css";

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
  addAgent: () => store.createNode('agent'),
  exportFlow: () => console.log(store.exportFlow())
});

const nodeTypes = {
  agent: Agent
};

export default function App() {
  const store = useStore(selector, shallow);

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  return (
    <div className="flow-container">
      <ReactFlowProvider>
        <ReactFlow
          nodes={store.nodes}
          nodeTypes={nodeTypes}
          edges={store.edges}
          onNodesChange={store.onNodesChange}
          onEdgesChange={store.onEdgesChange}
          onConnect={store.addEdge}
          fitView
        >
          <Panel className="space-x-4" position="top-right">
            <VSCodeButton onClick={store.addAgent}>Add Agent</VSCodeButton>
            <VSCodeButton onClick={store.exportFlow}>Save Workflow</VSCodeButton>
          </Panel>
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
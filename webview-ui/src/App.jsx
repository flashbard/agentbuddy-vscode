import React from 'react';
import ReactFlow, { Background, MiniMap, Panel, Controls } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { tw } from 'twind';

import { useStore } from './store';
import Agent from './nodes/Agent';

import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";

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
    <ReactFlow
      nodes={store.nodes}
      nodeTypes={nodeTypes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onEdgesChange={store.onEdgesChange}
      onConnect={store.addEdge}
    >
      <Panel className={tw('space-x-4')} position="top-right">
        <button className={tw('px-2 py-1 rounded bg-white shadow')} onClick={store.addAgent}>
          ➕
        </button>
        <button className={tw('px-2 py-1 rounded bg-white shadow')}>
          ▶️
        </button>
        <button className={tw('px-2 py-1 rounded bg-white shadow')} onClick={store.exportFlow}>
          💾
        </button>
        <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
      </Panel>
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
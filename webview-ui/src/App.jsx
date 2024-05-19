import React from "react";
import ReactFlow, { Background, MiniMap, Panel, Controls, ReactFlowProvider } from "reactflow";
import { shallow } from "zustand/shallow";
import CrewAiExporter from "./exporters/CrewAiExporter";

import { useStore } from "./store";
import Agent from "./nodes/Agent";
import Task from "./nodes/Task";

import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import "./index.css";

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
  addAgent: () => store.createNode("agent"),
  addTask: () => store.createNode("task"),
  exportFlow: () => {
    console.log(new CrewAiExporter(store.exportFlow()).export());
  },
});

const nodeTypes = {
  agent: Agent,
  task: Task,
};

export default function App() {
  const store = useStore(selector, shallow);

  function exportFlow() {
    vscode.postMessage({
      command: "exportFlow",
      text: store.exportFlow(),
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
          fitView>
          <Panel className="space-x-4" position="top-right">
            <VSCodeButton onClick={store.addAgent}>Add Agent</VSCodeButton>
            <VSCodeButton onClick={store.addTask}>Add Task</VSCodeButton>
            <VSCodeButton onClick={exportFlow}>Save Workflow</VSCodeButton>
          </Panel>
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

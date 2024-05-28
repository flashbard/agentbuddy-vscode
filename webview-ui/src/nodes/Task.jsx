import React from "react";
import { Handle, NodeResizer } from "reactflow";
import { shallow } from "zustand/shallow";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setDescription: (e) => store.updateNode(id, { description: e.target.value }),
  setOutcome: (e) => store.updateNode(id, { outcome: e.target.value }),
});

export default function Task({ id, data }) {
  const { setDescription, setOutcome } = useStore(selector(id), shallow);

  return (
    <div className="rounded-md bg-white shadow-xl">
      <NodeResizer />
      <p className="rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm">Task</p>

      <label className="flex flex-col px-2 py-1">
        <span className="text-xs font-bold mb-2">Description</span>
        <textarea
          className="nodrag border text-xs rounded focus:outline-none focus:ring focus:border-blue-500"
          value={data.description}
          onChange={setDescription}
        />
      </label>

      <label className="flex flex-col px-2 pt-1 pb-4">
        <span className="text-xs font-bold mb-2">Outcome</span>
        <textarea
          className="nodrag border rounded text-xs focus:outline-none focus:ring focus:border-blue-500"
          value={data.outcome}
          onChange={setOutcome}
        />
      </label>

      <Handle id="taskOut" className="w-2 h-2" type="source" position="bottom" />
    </div>
  );
}

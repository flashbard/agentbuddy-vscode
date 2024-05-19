import React from 'react';
import { Handle, NodeResizer } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';

const selector = (id) => (store) => ({
  setRole: (e) => store.updateNode(id, { role: e.target.value }),
  setGoal: (e) => store.updateNode(id, { goal: e.target.value }),
  setLlm: (e) => store.updateNode(id, { llm: e.target.value })
});

export default function Agent({ id, data }) {
  const { setRole, setGoal, setLlm } = useStore(selector(id), shallow);

  return (
    <div className="rounded-md bg-white shadow-xl">
      <NodeResizer />
      <p className="rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm">Agent</p>

      <label className="flex flex-col px-2 py-1">
        <span className="text-xs font-bold mb-2">Role</span>
        <input
          className="border rounded p-1 focus:outline-none focus:ring focus:border-blue-500"
          type="text"
          value={data.role}
          onChange={setRole} />
      </label>

      <label className="flex flex-col px-2 pt-1 pb-4">
        <span className="text-xs font-bold mb-2">Goal</span>
        <textarea
          className={"nodrag border rounded text-xs focus:outline-none focus:ring focus:border-blue-500"}
          value={data.goal}
          onChange={setGoal} />
      </label>

      <hr className="border-gray-200 mx-2" />

      <label className="flex flex-col px-2 pt-1 pb-4">
        <p className="text-xs font-bold mb-2">LLM</p>
        <select className={"nodrag text-xs"} value={data.llm} onChange={setLlm}>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
        </select>
      </label>

      {/* Connections to other agents*/}
      <Handle id="in" className="w-2 h-2" type="target" position="left" />
      <Handle id="out" className="w-2 h-2" type="source" position="right" />

      {/* Connections to tools and tasks */}
      <Handle id="tool" className="w-2 h-2" type="target" position="top" />
      <Handle id="task" className="w-2 h-2" type="target" position="bottom" />
    </div>
  );
};


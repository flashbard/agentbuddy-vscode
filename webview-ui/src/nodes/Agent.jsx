import React from 'react';
import { Handle } from 'reactflow';
import { tw } from 'twind';
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
    <div className={tw('rounded-md bg-white shadow-xl')}>
      <p className={tw('rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm')}>Agent</p>

      <label className={tw('flex flex-col px-2 py-1')}>
        <span className={tw('text-xs font-bold mb-2')}>Role</span>
        <input
          className={tw`border rounded p-1 focus:outline-none focus:ring focus:border-blue-500`}
          type="text"
          value={data.role}
          onChange={setRole} />
      </label>

      <label className={tw('flex flex-col px-2 pt-1 pb-4')}>
        <span className={tw('text-xs font-bold mb-2')}>Goal</span>
        <textarea
          className={`nodrag ${tw('border rounded text-xs focus:outline-none focus:ring focus:border-blue-500')}`}
          type="text"
          value={data.goal}
          onChange={setGoal} />
      </label>

      <hr className={tw('border-gray-200 mx-2')} />

      <label className={tw('flex flex-col px-2 pt-1 pb-4')}>
        <p className={tw('text-xs font-bold mb-2')}>LLM</p>
        <select className={`nodrag ${tw('text-xs')}`} value={data.llm} onChange={setLlm}>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
        </select>
      </label>

      {/* Connections to other agents*/}
      <Handle id="in" className={tw('w-2 h-2')} type="target" position="left" />
      <Handle id="out" className={tw('w-2 h-2')} type="source" position="right" />

      {/* Connections to tools and tasks */}
      <Handle id="tool" className={tw('w-2 h-2')} type="target" position="top" />
      <Handle id="task" className={tw('w-2 h-2')} type="target" position="bottom" />
    </div>
  );
};


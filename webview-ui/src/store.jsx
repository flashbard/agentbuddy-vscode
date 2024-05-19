import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { createWithEqualityFn } from 'zustand/traditional';

export const useStore = createWithEqualityFn((set, get) => ({
  nodes: [],
  edges: [],

  exportFlow() {
    const flow = {
      nodes: get().nodes,
      edges: get().edges
    };

    return flow;
  },

  updateNode(id, data) {
    set({
      nodes: get().nodes.map(node =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    });
  },

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge(data) {
    const id = nanoid(6);
    const edge = { id, ...data };

    set({ edges: [edge, ...get().edges] });
  },

  createNode(type, x, y) {
    const id = nanoid();

    switch (type) {
      case 'agent': {
        const data = {};
        const position = { x: 0, y: 0 };

        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
    }
  }
}));
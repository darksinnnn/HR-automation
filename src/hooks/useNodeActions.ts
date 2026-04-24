import useWorkflowStore from '../store/workflowStore';

export const useNodeActions = (nodeId: string) => {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const nodes = useWorkflowStore((s) => s.nodes);
  const addNode = useWorkflowStore((s) => s.addNode);

  const handleDelete = () => {
    if (confirm('Delete this node? This action cannot be undone.')) {
      deleteNode(nodeId);
    }
  };

  const handleDuplicate = () => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const newNode = {
      ...node,
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: { ...node.data },
    };
    addNode(newNode);
  };

  return { handleDelete, handleDuplicate };
};

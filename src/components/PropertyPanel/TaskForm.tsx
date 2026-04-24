import React from 'react';
import { Plus, X } from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';
import type { TaskNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: TaskNodeData;
}

const TaskForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (field: string, value: any) => {
    updateNodeData(nodeId, { [field]: value });
  };

  const handleCustomFieldAdd = () => {
    const fields = { ...(data.customFields || {}) };
    const key = `field_${Object.keys(fields).length + 1}`;
    fields[key] = '';
    handleChange('customFields', fields);
  };

  const handleCustomFieldChange = (oldKey: string, newKey: string, value: string) => {
    const fields = { ...(data.customFields || {}) };
    if (oldKey !== newKey) {
      delete fields[oldKey];
    }
    fields[newKey] = value;
    handleChange('customFields', fields);
  };

  const handleCustomFieldRemove = (key: string) => {
    const fields = { ...(data.customFields || {}) };
    delete fields[key];
    handleChange('customFields', fields);
  };

  return (
    <div className="panel-body">
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Collect Documents"
          id="task-title-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What needs to be done in this task..."
          id="task-desc-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Assignee</label>
        <input
          className="form-input"
          type="text"
          value={data.assignee || ''}
          onChange={(e) => handleChange('assignee', e.target.value)}
          placeholder="e.g., John Smith"
          id="task-assignee-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Due Date</label>
        <input
          className="form-input"
          type="date"
          value={data.dueDate || ''}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          id="task-due-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Custom Fields (Key-Value)</label>
        <div className="kv-editor">
          {Object.entries(data.customFields || {}).map(([key, value]) => (
            <div className="kv-row" key={key}>
              <input
                className="form-input"
                placeholder="Field name"
                value={key}
                onChange={(e) => handleCustomFieldChange(key, e.target.value, value)}
              />
              <input
                className="form-input"
                placeholder="Value"
                value={value}
                onChange={(e) => handleCustomFieldChange(key, key, e.target.value)}
              />
              <button className="kv-remove-btn" onClick={() => handleCustomFieldRemove(key)}>
                <X />
              </button>
            </div>
          ))}
          <button className="kv-add-btn" onClick={handleCustomFieldAdd}>
            <Plus /> Add Field
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;

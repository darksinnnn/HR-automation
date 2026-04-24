import React from 'react';
import useWorkflowStore from '../../store/workflowStore';
import type { ConditionNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: ConditionNodeData;
}

const ConditionForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateNodeData(nodeId, { [e.target.name]: e.target.value });
  };

  return (
    <div className="panel-body">
      <div className="form-group">
        <label className="form-label">Node Title</label>
        <input
          className="form-input"
          type="text"
          name="title"
          value={data.title || ''}
          onChange={handleChange}
          placeholder="e.g., Check Salary"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Condition Field</label>
        <input
          className="form-input"
          type="text"
          name="conditionField"
          value={data.conditionField || ''}
          onChange={handleChange}
          placeholder="e.g., candidate.salary"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Operator</label>
        <select
          className="form-input"
          name="conditionOperator"
          value={data.conditionOperator || '==='}
          onChange={handleChange}
        >
          <option value="===">Equals</option>
          <option value="!==">Not Equals</option>
          <option value=">">Greater Than</option>
          <option value="<">Less Than</option>
          <option value=">=">Greater or Equal</option>
          <option value="<=">Less or Equal</option>
          <option value="contains">Contains</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Value</label>
        <input
          className="form-input"
          type="text"
          name="conditionValue"
          value={data.conditionValue || ''}
          onChange={handleChange}
          placeholder="e.g., 50000"
        />
      </div>
    </div>
  );
};

export default ConditionForm;

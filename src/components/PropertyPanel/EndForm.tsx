import React from 'react';
import useWorkflowStore from '../../store/workflowStore';
import type { EndNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: EndNodeData;
}

const EndForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (field: string, value: any) => {
    updateNodeData(nodeId, { [field]: value });
  };

  return (
    <div className="panel-body">
      <div className="form-group">
        <label className="form-label">End Message</label>
        <input
          className="form-input"
          type="text"
          value={data.endMessage || ''}
          onChange={(e) => handleChange('endMessage', e.target.value)}
          placeholder="e.g., Onboarding Complete"
          id="end-message-input"
        />
      </div>

      <div className="form-toggle">
        <span className="form-toggle-label">Generate Summary Report</span>
        <div
          className={`toggle-switch ${data.summaryFlag ? 'active' : ''}`}
          onClick={() => handleChange('summaryFlag', !data.summaryFlag)}
          id="end-summary-toggle"
        />
      </div>
    </div>
  );
};

export default EndForm;

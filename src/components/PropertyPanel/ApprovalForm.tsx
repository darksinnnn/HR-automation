import React from 'react';
import useWorkflowStore from '../../store/workflowStore';
import type { ApprovalNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: ApprovalNodeData;
}

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'CEO', 'Department Head', 'Team Lead'];

const ApprovalForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (field: string, value: any) => {
    updateNodeData(nodeId, { [field]: value });
  };

  return (
    <div className="panel-body">
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Manager Approval"
          id="approval-title-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Approver Role</label>
        <select
          className="form-select"
          value={data.approverRole || ''}
          onChange={(e) => handleChange('approverRole', e.target.value)}
          id="approval-role-input"
        >
          <option value="">Select a role...</option>
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Auto-Approve Threshold</label>
        <input
          className="form-input"
          type="number"
          min="0"
          value={data.autoApproveThreshold || 0}
          onChange={(e) => handleChange('autoApproveThreshold', parseInt(e.target.value) || 0)}
          placeholder="0 = manual approval only"
          id="approval-threshold-input"
        />
        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          Requests below this value get auto-approved
        </span>
      </div>
    </div>
  );
};

export default ApprovalForm;

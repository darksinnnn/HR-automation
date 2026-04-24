import React from 'react';
import useWorkflowStore from '../../store/workflowStore';
import type { EmailNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: EmailNodeData;
}

const EmailForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          placeholder="e.g., Send Welcome Email"
        />
      </div>

      <div className="form-group">
        <label className="form-label">To Details</label>
        <input
          className="form-input"
          type="email"
          name="to"
          value={data.to || ''}
          onChange={handleChange}
          placeholder="e.g., new.hire@company.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Subject</label>
        <input
          className="form-input"
          type="text"
          name="subject"
          value={data.subject || ''}
          onChange={handleChange}
          placeholder="e.g., Welcome to the Team!"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Body</label>
        <textarea
          className="form-input"
          name="body"
          value={data.body || ''}
          onChange={handleChange}
          placeholder="Email body text..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default EmailForm;

import React from 'react';
import '../styles/SaveTeamModal.css';

const SaveTeamModal = ({ teamName, teamDescription, onNameChange, onDescriptionChange, onSave, onClose, loading }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content save-team-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <h2>💾 Save This Team</h2>
        <p>Give your team a name and optional description</p>

        <div className="save-team-form">
          <div className="form-group">
            <label htmlFor="teamName">Team Name *</label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g., Water Sweep Team"
              disabled={loading}
              className="team-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="teamDescription">Description (Optional)</label>
            <textarea
              id="teamDescription"
              value={teamDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Add notes about this team's strategy..."
              disabled={loading}
              className="team-textarea"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              onClick={onSave}
              disabled={loading || !teamName.trim()}
              className="save-btn-primary"
            >
              {loading ? '💾 Saving...' : '💾 Save Team'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="save-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveTeamModal;

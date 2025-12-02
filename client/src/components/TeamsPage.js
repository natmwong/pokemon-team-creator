import React, { useState } from 'react';
import SavedTeams from './SavedTeams';
import '../styles/TeamsPage.css';

const TeamsPage = ({ userId, onLoadTeam, onSwitchToBuilder }) => {
  return (
    <div className="teams-page">
      <div className="teams-header">
        <h1>📚 My Saved Teams</h1>
        <p>Manage and load your previously created Pokémon teams</p>
      </div>

      <div className="teams-content">
        <SavedTeams 
          userId={userId} 
          onLoadTeam={(team) => {
            onLoadTeam(team);
            onSwitchToBuilder();
          }}
        />
      </div>
    </div>
  );
};

export default TeamsPage;

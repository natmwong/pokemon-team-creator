import React, { useState, useEffect } from 'react';
import { getUserTeams, deleteTeam, updateTeam } from '../services/teamService';
import '../styles/SavedTeams.css';

const SavedTeams = ({ userId, onLoadTeam }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadTeams();
  }, [userId]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const userTeams = await getUserTeams(userId);
      setTeams(userTeams);
    } catch (err) {
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTeam = (team) => {
    onLoadTeam(team);
  };

  const handleDeleteTeam = async (teamId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    setDeletingId(teamId);
    try {
      await deleteTeam(teamId);
      // Remove the team from the list immediately
      setTeams(teams.filter(t => t.id !== teamId));
      setError(''); // Clear any existing errors
    } catch (err) {
      console.error('Delete team error:', err);
      setError(err.message || 'Failed to delete team');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRenameTeam = async (teamId) => {
    if (!newName.trim()) {
      setRenamingId(null);
      return;
    }

    try {
      await updateTeam(teamId, { name: newName });
      setTeams(teams.map(t => 
        t.id === teamId ? { ...t, name: newName } : t
      ));
      setRenamingId(null);
      setNewName('');
    } catch (err) {
      setError(err.message || 'Failed to rename team');
    }
  };

  const handleStartRename = (team, e) => {
    e.stopPropagation();
    setRenamingId(team.id);
    setNewName(team.name);
  };

  const handleLoadTeamClick = (team, e) => {
    e.stopPropagation();
    handleLoadTeam(team);
  };

  if (loading) {
    return <div className="saved-teams loading">Loading your teams...</div>;
  }

  if (teams.length === 0) {
    return (
      <div className="saved-teams empty">
        <p>No saved teams yet. Generate a team and save it!</p>
      </div>
    );
  }

  return (
    <div className="saved-teams">
      <h3>📚 Your Saved Teams</h3>
      
      {error && <div className="saved-teams-error">{error}</div>}

      <div className="teams-list">
        {teams.map((team) => (
          <div key={team.id} className="team-item">
            <div 
              className="team-header"
              onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
            >
              <div className="team-title-section">
                {renamingId === team.id ? (
                  <div className="rename-input-group">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Team name"
                      autoFocus
                    />
                    <button 
                      onClick={() => handleRenameTeam(team.id)}
                      className="rename-save-btn"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => setRenamingId(null)}
                      className="rename-cancel-btn"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <h4>{team.name}</h4>
                    <span className="pokemon-count">{team.pokemon?.length || 0}/6 Pokemon</span>
                  </>
                )}
              </div>

              <div className="team-actions">
                {renamingId !== team.id && (
                  <>
                    <button
                      onClick={(e) => handleStartRename(team, e)}
                      className="action-btn rename-btn"
                      title="Rename team"
                      type="button"
                      disabled={deletingId === team.id}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDeleteTeam(team.id, e)}
                      className="action-btn delete-btn"
                      title="Delete team"
                      type="button"
                      disabled={deletingId === team.id}
                    >
                      {deletingId === team.id ? '⏳' : '🗑️'}
                    </button>
                  </>
                )}
                <span className="expand-icon">
                  {expandedTeamId === team.id ? '▼' : '▶'}
                </span>
              </div>
            </div>

            {expandedTeamId === team.id && (
              <div className="team-details">
                {team.pokemon && team.pokemon.length > 0 && (
                  <div className="detail-section pokemon-section">
                    <strong>🎮 Pokémon Team:</strong>
                    <div className="pokemon-gallery">
                      {team.pokemon.map((p, i) => {
                        const pokemonName = p.name || p;
                        // Use PokéAPI endpoint for official artwork
                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
                        return (
                          <div key={i} className="pokemon-card">
                            <img 
                              src={imageUrl}
                              alt={pokemonName}
                              className="pokemon-image"
                              onError={(e) => {
                                // Try alternative URL format if first one fails
                                if (!e.target.src.includes('placeholder')) {
                                  e.target.src = 'https://via.placeholder.com/96?text=' + pokemonName;
                                } else {
                                  e.target.style.display = 'none';
                                }
                              }}
                            />
                            <span className="pokemon-name">{pokemonName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {team.strategy && (
                  <div className="detail-section">
                    <strong>Strategy:</strong>
                    <p>{team.strategy}</p>
                  </div>
                )}

                {team.description && (
                  <div className="detail-section">
                    <strong>Description:</strong>
                    <p>{team.description}</p>
                  </div>
                )}

                {team.updatedAt && (
                  <div className="detail-section">
                    <strong>Last Updated:</strong>
                    <p>{new Date(team.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}

                <button
                  onClick={(e) => handleLoadTeamClick(team, e)}
                  className="load-team-btn"
                  type="button"
                >
                  Load This Team
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedTeams;

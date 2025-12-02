import React, { useEffect } from 'react';
import '../styles/RecommendationsModal.css';

const getTypeColor = (type) => {
  const colors = {
    Normal: '#A8A878',
    Fire: '#F08030',
    Water: '#6890F0',
    Grass: '#78C850',
    Electric: '#F8D030',
    Ice: '#98D8D8',
    Fighting: '#C03028',
    Poison: '#A040A0',
    Ground: '#E0C068',
    Flying: '#A890F0',
    Psychic: '#F85888',
    Bug: '#A8B820',
    Rock: '#B8A038',
    Ghost: '#705898',
    Dragon: '#7038F8',
    Dark: '#705848',
    Steel: '#B8B8D0',
    Fairy: '#EE99AC',
  };
  return colors[type] || '#A8A8A8';
};

const RecommendationsModal = ({ recommendations, loading, error, onClose, onSaveClick }) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!recommendations && !loading && !error) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {loading && (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>✨ Generating recommendations...</p>
            <button className="modal-close-btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        )}

        {error && (
          <div className="modal-error">
            <p>❌ {error}</p>
            <button className="modal-close-btn-secondary" onClick={onClose}>Close</button>
          </div>
        )}

        {recommendations && !loading && (
          <>
            <h2>🎯 AI-Generated Team Recommendations</h2>

            {/* Suggested Pokemon */}
            {recommendations.suggestedPokemon && recommendations.suggestedPokemon.length > 0 && (
              <div className="recommendation-section suggested-section">
                <h3>➕ Suggested Pokemon to Add</h3>
                <div className="suggested-pokemon-list">
                  {recommendations.suggestedPokemon.map((pokemon, index) => (
                    <div key={index} className="suggested-pokemon-tag">
                      {pokemon}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Composition */}
            {recommendations.teamComposition && recommendations.teamComposition.length > 0 && (
              <div className="recommendation-section composition-section">
                <h3>👥 Detailed Team Composition</h3>
                <div className="composition-grid">
                  {recommendations.teamComposition.map((member, index) => (
                    <div key={index} className="team-member-card">
                      <div className="member-header">
                        <h4>{member.name}</h4>
                        {member.role && <span className="member-role">{member.role}</span>}
                      </div>

                      <div className="member-info">
                        {/* Moves */}
                        <div className="info-section">
                          <strong>🎮 Moves:</strong>
                          <ul className="moves-list">
                            {member.moves && (Array.isArray(member.moves) ? (
                              typeof member.moves[0] === 'object' ? (
                                member.moves.map((move, i) => (
                                  <li key={i} className="move-item">
                                    <span className="move-name">{move.name || move}</span>
                                    {move.type && <span className="move-type" style={{backgroundColor: getTypeColor(move.type)}}>{move.type}</span>}
                                    {move.purpose && <span className="move-purpose">{move.purpose}</span>}
                                  </li>
                                ))
                              ) : (
                                member.moves.map((move, i) => (
                                  <li key={i}>{move}</li>
                                ))
                              )
                            ) : null)}
                          </ul>
                        </div>

                        {/* Held Item */}
                        <div className="info-section">
                          <strong>🎁 Held Item:</strong>
                          <p className="item-name">{member.heldItem}</p>
                          {member.itemReasoning && (
                            <p className="item-reasoning">{member.itemReasoning}</p>
                          )}
                        </div>

                        {/* Why this Pokemon */}
                        {member.reasoning && (
                          <div className="info-section">
                            <strong>💡 Role & Purpose:</strong>
                            <p>{member.reasoning}</p>
                          </div>
                        )}

                        {/* Synergy with team */}
                        {member.synergy && (
                          <div className="info-section synergy-section">
                            <strong>🔗 Team Synergy:</strong>
                            <ul className="synergy-list">
                              {member.synergy.map((syn, i) => (
                                <li key={i}>{syn}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Strategy */}
            {recommendations.overallStrategy && (
              <div className="recommendation-section strategy-section">
                <h3>🎲 Overall Strategy</h3>
                <p>{recommendations.overallStrategy}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-actions">
              <button className="modal-save-btn" onClick={onSaveClick}>
                💾 Save This Team
              </button>
              <button className="modal-close-btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationsModal;

import React from 'react';
import '../styles/Recommendations.css';

const Recommendations = ({ recommendations, loading = false, error = null }) => {
  if (loading) {
    return <div className="recommendations loading">✨ Generating recommendations...</div>;
  }

  if (error) {
    return <div className="recommendations error">❌ {error}</div>;
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="recommendations">
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
                          // New format with move details
                          member.moves.map((move, i) => (
                            <li key={i} className="move-item">
                              <span className="move-name">{move.name || move}</span>
                              {move.type && <span className="move-type" style={{backgroundColor: getTypeColor(move.type)}}>{move.type}</span>}
                              {move.purpose && <span className="move-purpose">{move.purpose}</span>}
                            </li>
                          ))
                        ) : (
                          // Old format - just names
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

      {/* Type Coverage Analysis */}
      {recommendations.typeCoverage && (
        <div className="recommendation-section coverage-section">
          <h3>🔄 Type Coverage Analysis</h3>
          <div className="coverage-content">
            {recommendations.typeCoverage.strengths && (
              <div className="coverage-subsection">
                <strong>✅ Strengths Against:</strong>
                <div className="type-badges">
                  {recommendations.typeCoverage.strengths.map((type, i) => (
                    <span key={i} className={`type-badge type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {recommendations.typeCoverage.weaknesses && (
              <div className="coverage-subsection">
                <strong>⚠️ Weaknesses Against:</strong>
                <div className="type-badges">
                  {recommendations.typeCoverage.weaknesses.map((type, i) => (
                    <span key={i} className={`type-badge type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {recommendations.typeCoverage.coverage && (
              <div className="coverage-subsection">
                <strong>📊 Coverage Details:</strong>
                <p>{recommendations.typeCoverage.coverage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Strategy */}
      {recommendations.teamStrategy && (
        <div className="recommendation-section strategy-section">
          <h3>🏆 Overall Team Strategy</h3>
          <div className="strategy-box">
            <p>{recommendations.teamStrategy}</p>
          </div>
        </div>
      )}

      {/* Team Synergy */}
      {recommendations.synergy && (
        <div className="recommendation-section synergy-detail-section">
          <h3>⚡ Team Synergy Analysis</h3>
          <div className="synergy-box">
            <p>{recommendations.synergy}</p>
          </div>
        </div>
      )}

      {/* Tactical Advice */}
      {recommendations.advice && recommendations.advice.length > 0 && (
        <div className="recommendation-section advice-section">
          <h3>💪 Tactical Advice</h3>
          <ul className="advice-list">
            {recommendations.advice.map((advice, index) => (
              <li key={index}>{advice}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Legacy tips support */}
      {recommendations.tips && recommendations.tips.length > 0 && !recommendations.advice && (
        <div className="recommendation-section advice-section">
          <h3>💪 Tips</h3>
          <ul className="advice-list">
            {recommendations.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Helper function to get type colors
const getTypeColor = (type) => {
  const colors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };
  return colors[type.toLowerCase()] || '#999';
};

export default Recommendations;

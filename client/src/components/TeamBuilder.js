import React, { useState } from 'react';
import '../styles/TeamBuilder.css';

const TeamBuilder = ({ selectedPokemon, onStrategyChange, onGenerateTeam, onRemovePokemon, loading = false }) => {
  const [strategy, setStrategy] = useState('');
  const [error, setError] = useState(null);

  const handleGenerate = () => {
    if (!strategy.trim()) {
      setError('Please enter a strategy request');
      return;
    }

    if (selectedPokemon.length === 0) {
      setError('Please select at least one Pokemon or leave empty for random team');
    } else {
      setError(null);
      onGenerateTeam(strategy);
    }
  };

  const handleStrategyChange = (e) => {
    const value = e.target.value;
    setStrategy(value);
    onStrategyChange(value);
  };

  return (
    <div className="team-builder">
      <div className="builder-section">
        <h3>Current Team</h3>
        <div className="current-team">
          {selectedPokemon.length === 0 ? (
            <p className="empty-team">No Pokemon selected yet</p>
          ) : (
            <ul className="team-list">
              {selectedPokemon.map((pokemon, index) => (
                <li key={index} className="team-member">
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="team-member-image"
                  />
                  <span>{pokemon.name}</span>
                  <button
                    onClick={() => onRemovePokemon(index)}
                    className="remove-pokemon-btn"
                    title="Remove from team"
                    type="button"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="builder-section">
        <h3>Team Strategy</h3>
        <p className="strategy-help">
          Describe what you'd like your team to do. Examples: "make it bulkier", "counter dragon types", "optimize for competitive"
        </p>
        <textarea
          value={strategy}
          onChange={handleStrategyChange}
          placeholder="Enter your team strategy..."
          className="strategy-input"
          rows="5"
          disabled={loading}
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      <button
        onClick={handleGenerate}
        className="generate-btn"
        disabled={loading}
      >
        {loading ? 'Generating Team...' : 'Generate Team'}
      </button>
    </div>
  );
};

export default TeamBuilder;

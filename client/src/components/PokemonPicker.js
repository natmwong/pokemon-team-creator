import React, { useState, useEffect } from 'react';
import { pokemonAPI } from '../api';
import '../styles/PokemonPicker.css';

const PokemonPicker = ({ selectedPokemon, onSelect, maxTeamSize = 6 }) => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const response = await pokemonAPI.getAllPokemon();
      setAllPokemon(response.data.pokemon);
      setError(null);
    } catch (err) {
      setError('Failed to load Pokemon list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPokemon = allPokemon.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (pokemonName) => 
    selectedPokemon.some(p => p.name === pokemonName);

  const togglePokemon = (pokemon) => {
    if (isSelected(pokemon.name)) {
      // Remove Pokemon
      onSelect(selectedPokemon.filter(p => p.name !== pokemon.name));
    } else if (selectedPokemon.length < maxTeamSize) {
      // Add Pokemon
      onSelect([...selectedPokemon, pokemon]);
    }
  };

  if (loading) {
    return <div className="pokemon-picker loading">Loading Pokemon...</div>;
  }

  return (
    <div className="pokemon-picker">
      <div className="picker-header">
        <h3>Select Pokemon (0-{maxTeamSize})</h3>
        <p className="selected-count">
          Selected: {selectedPokemon.length}/{maxTeamSize}
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="pokemon-grid">
        {filteredPokemon.map(pokemon => (
          <div
            key={pokemon.id}
            className={`pokemon-card ${isSelected(pokemon.name) ? 'selected' : ''}`}
            onClick={() => togglePokemon(pokemon)}
          >
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="pokemon-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/96?text=Pokemon';
              }}
            />
            <div className="pokemon-info">
              <div className="pokemon-name">{pokemon.name}</div>
              <div className="pokemon-types">
                {pokemon.types.map(type => (
                  <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
            {isSelected(pokemon.name) && (
              <div className="selected-badge">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonPicker;

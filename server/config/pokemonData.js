/**
 * Pokemon data - fetched dynamically from PokeAPI
 * This retrieves all Pokemon data from the free PokeAPI endpoint
 */

const axios = require('axios');

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Cache for Pokemon list to avoid repeated API calls
let pokemonCache = null;
let cacheTimestamp = null;

/**
 * Get image URL for a Pokemon
 * @param {number|string} pokemonId - Pokemon ID or name
 * @returns {string} - URL to official artwork
 */
const getImageUrl = (pokemonId) => {
  const id = typeof pokemonId === 'string' 
    ? pokemonId.toLowerCase().replace(/[^a-z0-9]/g, '')
    : pokemonId;
  
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

/**
 * Fetch all Pokemon from PokeAPI with caching
 * @param {number} limit - Number of Pokemon to fetch (default 1000 for all)
 * @returns {Promise<Array>} - Array of Pokemon with id, name, and types
 */
const getAllPokemon = async (limit = 1000) => {
  try {
    // Check cache
    if (pokemonCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      return pokemonCache;
    }

    // Fetch Pokemon list
    const listResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=0`, {
      timeout: 10000
    });

    // Process Pokemon in batches of 20 to avoid overwhelming the API
    const pokemonList = listResponse.data.results;
    const batchSize = 20;
    const allPokemonData = [];

    for (let i = 0; i < pokemonList.length; i += batchSize) {
      const batch = pokemonList.slice(i, i + batchSize);
      
      const pokemonPromises = batch.map(async (pokemon) => {
        try {
          const response = await axios.get(pokemon.url, { timeout: 10000 });
          const data = response.data;

          return {
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            types: data.types.map(t => 
              t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
            ),
            imageUrl: getImageUrl(data.id),
            height: data.height,
            weight: data.weight,
            baseExperience: data.base_experience
          };
        } catch (error) {
          console.warn(`Failed to fetch details for ${pokemon.name}: ${error.message}`);
          return null;
        }
      });

      // Use allSettled to handle partial failures gracefully
      const results = await Promise.allSettled(pokemonPromises);
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value !== null) {
          allPokemonData.push(result.value);
        }
      });

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < pokemonList.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Cache the results
    pokemonCache = allPokemonData;
    cacheTimestamp = Date.now();

    return allPokemonData;
  } catch (error) {
    console.error('Error fetching Pokemon from PokeAPI:', error.message);
    throw error;
  }
};

/**
 * Get a single Pokemon by name or ID
 * @param {string|number} nameOrId - Pokemon name or ID
 * @returns {Promise<Object>} - Pokemon data
 */
const getPokemonByNameOrId = async (nameOrId) => {
  try {
    const response = await axios.get(
      `${POKEAPI_BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`,
      { timeout: 5000 }
    );

    const data = response.data;

    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      types: data.types.map(t => 
        t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
      ),
      imageUrl: getImageUrl(data.id),
      height: data.height,
      weight: data.weight,
      baseExperience: data.base_experience,
      abilities: data.abilities.map(a => 
        a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)
      ),
      stats: data.stats.map(s => ({
        name: s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1),
        baseStat: s.base_stat
      }))
    };
  } catch (error) {
    console.error(`Error fetching Pokemon ${nameOrId}:`, error.message);
    throw error;
  }
};

/**
 * Search for Pokemon by name (partial matching)
 * @param {string} searchTerm - Partial or full Pokemon name
 * @returns {Promise<Array>} - Matching Pokemon
 */
const searchPokemon = async (searchTerm) => {
  try {
    const allPokemon = await getAllPokemon();
    const lowerSearch = searchTerm.toLowerCase();

    return allPokemon.filter(p =>
      p.name.toLowerCase().includes(lowerSearch)
    );
  } catch (error) {
    console.error('Error searching Pokemon:', error.message);
    throw error;
  }
};

/**
 * Get Pokemon by type
 * @param {string} type - Pokemon type name
 * @returns {Promise<Array>} - Pokemon of that type
 */
const getPokemonByType = async (type) => {
  try {
    const response = await axios.get(
      `${POKEAPI_BASE_URL}/type/${type.toLowerCase()}`,
      { timeout: 5000 }
    );

    return response.data.pokemon.map(p => ({
      name: p.pokemon.name.charAt(0).toUpperCase() + p.pokemon.name.slice(1),
      id: p.pokemon.url.split('/')[6]
    }));
  } catch (error) {
    console.error(`Error fetching Pokemon of type ${type}:`, error.message);
    throw error;
  }
};

/**
 * Clear the cache to force a fresh fetch
 */
const clearCache = () => {
  pokemonCache = null;
  cacheTimestamp = null;
};

module.exports = {
  getAllPokemon,
  getPokemonByNameOrId,
  searchPokemon,
  getPokemonByType,
  getImageUrl,
  clearCache
};

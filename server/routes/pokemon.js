const express = require('express');
const router = express.Router();
const { getAllPokemon, getPokemonByNameOrId, searchPokemon, getPokemonByType } = require('../config/pokemonData');
const logger = require('../utils/logger');

/**
 * GET /api/pokemon
 * Get list of all available Pokemon (with caching)
 */
router.get('/', async (req, res) => {
  try {
    logger.info('Fetching all Pokemon from PokeAPI');
    
    // Optional limit parameter (default 1000 for all Gen 1-9)
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000;
    
    const pokemon = await getAllPokemon(limit);

    res.json({
      count: pokemon.length,
      pokemon: pokemon
    });
  } catch (error) {
    logger.error(`Error fetching Pokemon list: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch Pokemon list' });
  }
});

/**
 * GET /api/pokemon/search/:name
 * Search for Pokemon by name (partial matching)
 */
router.get('/search/:name', async (req, res) => {
  try {
    const searchTerm = req.params.name;
    logger.info(`Searching for Pokemon: ${searchTerm}`);

    const results = await searchPokemon(searchTerm);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    res.json({ 
      count: results.length,
      results 
    });
  } catch (error) {
    logger.error(`Error searching for Pokemon: ${error.message}`);
    res.status(500).json({ error: 'Failed to search Pokemon' });
  }
});

/**
 * GET /api/pokemon/type/:type
 * Get all Pokemon of a specific type
 */
router.get('/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    logger.info(`Fetching Pokemon of type: ${type}`);

    const pokemon = await getPokemonByType(type);

    if (pokemon.length === 0) {
      return res.status(404).json({ error: 'No Pokemon found for that type' });
    }

    res.json({
      type: type,
      count: pokemon.length,
      pokemon: pokemon
    });
  } catch (error) {
    logger.error(`Error fetching Pokemon by type: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch Pokemon by type' });
  }
});

/**
 * GET /api/pokemon/:id
 * Get specific Pokemon by ID or name
 */
router.get('/:id', async (req, res) => {
  try {
    const identifier = req.params.id;
    logger.info(`Fetching Pokemon: ${identifier}`);

    const pokemon = await getPokemonByNameOrId(identifier);

    res.json(pokemon);
  } catch (error) {
    logger.error(`Error fetching Pokemon: ${error.message}`);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }
    res.status(500).json({ error: 'Failed to fetch Pokemon' });
  }
});

module.exports = router;

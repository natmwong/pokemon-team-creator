const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { validateTeamRequest, sanitizeInput } = require('../utils/validation');
const llmClient = require('../llm/llmClient');
const actionExecutor = require('../actions/actionExecutor');

/**
 * POST /api/team/analyze
 * Analyze current team
 */
router.post('/analyze', async (req, res) => {
  try {
    const { team } = req.body;

    if (!Array.isArray(team) || team.length === 0) {
      return res.status(400).json({ error: 'Team must be a non-empty array' });
    }

    logger.info(`Analyzing team: ${team.join(', ')}`);

    // Get LLM analysis
    const analysis = await llmClient.analyzeTeam(team);

    // Parse the response
    const parsed = actionExecutor.parseLLMResponse(analysis);

    res.json({
      success: true,
      analysis: analysis,
      parsed: parsed
    });

  } catch (error) {
    logger.error(`Team analysis error: ${error.message}`);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/team/generate
 * Generate team recommendations based on strategy
 */
router.post('/generate', async (req, res) => {
  try {
    let { team = [], strategy } = req.body;

    // Sanitize inputs
    team = team.map(p => sanitizeInput(p));
    strategy = sanitizeInput(strategy);

    // Validate inputs
    const validation = validateTeamRequest(team, strategy);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    logger.info(`Generating team recommendations. Current team: ${team.join(', ')}, Strategy: ${strategy}`);

    // Send to LLM
    const llmResponse = await llmClient.generateTeamRecommendations(team, strategy);

    // Parse LLM response
    const recommendations = actionExecutor.parseLLMResponse(llmResponse);

    // Execute actions (in this case, just log them)
    const action = {
      type: 'GENERATE_TEAM',
      team: team,
      strategy: strategy
    };
    const executionResult = actionExecutor.executeAction(action);

    res.json({
      success: true,
      recommendations: recommendations,
      execution: executionResult,
      remainingRequests: llmClient.getRemainingRequests()
    });

  } catch (error) {
    logger.error(`Team generation error: ${error.message}`);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      error: error.message,
      resetTime: error.resetTime
    });
  }
});

/**
 * POST /api/team/suggest-movesets
 * Suggest movesets for given Pokemon
 */
router.post('/suggest-movesets', async (req, res) => {
  try {
    let { pokemon } = req.body;

    if (!Array.isArray(pokemon) || pokemon.length === 0) {
      return res.status(400).json({ error: 'Pokemon array is required' });
    }

    pokemon = pokemon.map(p => sanitizeInput(p));
    logger.info(`Suggesting movesets for: ${pokemon.join(', ')}`);

    const prompt = `
Suggest optimal movesets for these Pokemon: ${pokemon.join(', ')}

For each Pokemon, provide:
- 4 recommended moves
- Brief explanation of why these moves work well together

Format as JSON with this structure:
{
  "movesets": [
    {
      "pokemon": "name",
      "moves": ["move1", "move2", "move3", "move4"],
      "reasoning": "explanation"
    }
  ]
}`;

    const llmResponse = await llmClient.sendPrompt(prompt);
    const parsed = actionExecutor.parseLLMResponse(llmResponse);

    res.json({
      success: true,
      movesets: parsed,
      remainingRequests: llmClient.getRemainingRequests()
    });

  } catch (error) {
    logger.error(`Moveset suggestion error: ${error.message}`);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      error: error.message,
      resetTime: error.resetTime
    });
  }
});

/**
 * POST /api/team/suggest-items
 * Suggest held items for given Pokemon
 */
router.post('/suggest-items', async (req, res) => {
  try {
    let { pokemon } = req.body;

    if (!Array.isArray(pokemon) || pokemon.length === 0) {
      return res.status(400).json({ error: 'Pokemon array is required' });
    }

    pokemon = pokemon.map(p => sanitizeInput(p));
    logger.info(`Suggesting items for: ${pokemon.join(', ')}`);

    const prompt = `
Suggest optimal held items for these Pokemon: ${pokemon.join(', ')}

For each Pokemon, provide:
- Best held item
- Why this item is good for this Pokemon

Format as JSON with this structure:
{
  "items": [
    {
      "pokemon": "name",
      "item": "item_name",
      "reasoning": "explanation"
    }
  ]
}`;

    const llmResponse = await llmClient.sendPrompt(prompt);
    const parsed = actionExecutor.parseLLMResponse(llmResponse);

    res.json({
      success: true,
      items: parsed,
      remainingRequests: llmClient.getRemainingRequests()
    });

  } catch (error) {
    logger.error(`Item suggestion error: ${error.message}`);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      error: error.message,
      resetTime: error.resetTime
    });
  }
});

module.exports = router;

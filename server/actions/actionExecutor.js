/**
 * Action Executor Module
 * Parses LLM output and executes concrete actions
 */

const logger = require('../utils/logger');

class ActionExecutor {
  constructor() {
    this.executionLog = [];
  }

  /**
   * Parse LLM response and extract structured data
   * @param {string} llmResponse - Raw LLM response
   * @returns {Object} - Parsed action data
   */
  parseLLMResponse(llmResponse) {
    logger.info('Parsing LLM response');

    try {
      // Try to extract JSON from the response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        logger.warn('No JSON found in LLM response, attempting to parse as text');
        return this.parseTextResponse(llmResponse);
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      
      logger.info('Successfully parsed LLM response as JSON');
      return this.validateAndFormatResponse(parsed);

    } catch (error) {
      logger.error(`Error parsing LLM response: ${error.message}`);
      throw new Error(`Failed to parse LLM response: ${error.message}`);
    }
  }

  /**
   * Validate and format parsed LLM response
   * @param {Object} data - Parsed data
   * @returns {Object} - Validated and formatted data
   */
  validateAndFormatResponse(data) {
    const recommendations = data.recommendations || {};

    // Validate suggested Pokemon
    const suggestedPokemon = Array.isArray(recommendations.suggestedPokemon)
      ? recommendations.suggestedPokemon.filter(p => typeof p === 'string')
      : [];

    // Validate team composition
    const teamComposition = Array.isArray(recommendations.teamComposition)
      ? recommendations.teamComposition.filter(p => p && p.name)
      : [];

    return {
      suggestedPokemon,
      teamComposition,
      teamStrategy: recommendations.teamStrategy || 'No strategy provided',
      tips: Array.isArray(recommendations.tips) ? recommendations.tips : []
    };
  }

  /**
   * Parse text-based response (fallback)
   * @param {string} text - Text response
   * @returns {Object} - Parsed data
   */
  parseTextResponse(text) {
    logger.info('Parsing response as text format');

    return {
      suggestedPokemon: [],
      teamComposition: [],
      teamStrategy: text,
      tips: this.extractTips(text)
    };
  }

  /**
   * Extract tips/bullet points from text
   * @param {string} text - Text to extract from
   * @returns {string[]} - Array of tips
   */
  extractTips(text) {
    const lines = text.split('\n');
    const tips = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\.\s/)) {
        tips.push(trimmed.replace(/^[-•*\d.]\s+/, ''));
      }
    }

    return tips.length > 0 ? tips : ['See analysis above'];
  }

  /**
   * Execute action based on parsed recommendation
   * @param {Object} action - Action to execute
   * @returns {Object} - Execution result
   */
  executeAction(action) {
    logger.info(`Executing action: ${action.type}`);

    const result = {
      type: action.type,
      success: false,
      timestamp: new Date().toISOString(),
      data: null
    };

    try {
      switch (action.type) {
        case 'ADD_POKEMON':
          result.data = this.addPokemon(action.pokemon);
          result.success = true;
          break;

        case 'REMOVE_POKEMON':
          result.data = this.removePokemon(action.pokemon);
          result.success = true;
          break;

        case 'UPDATE_MOVESET':
          result.data = this.updateMoveset(action.pokemon, action.moves);
          result.success = true;
          break;

        case 'UPDATE_ITEM':
          result.data = this.updateHeldItem(action.pokemon, action.item);
          result.success = true;
          break;

        case 'ANALYZE':
          result.data = this.analyzeTeam(action.team);
          result.success = true;
          break;

        default:
          logger.warn(`Unknown action type: ${action.type}`);
          result.success = false;
      }

    } catch (error) {
      logger.error(`Action execution failed: ${error.message}`);
      result.success = false;
      result.error = error.message;
    }

    this.executionLog.push(result);
    return result;
  }

  /**
   * Simulate adding a Pokemon to the team
   */
  addPokemon(pokemon) {
    return {
      action: 'Added Pokemon',
      pokemon: pokemon,
      message: `${pokemon} has been added to your team`
    };
  }

  /**
   * Simulate removing a Pokemon from the team
   */
  removePokemon(pokemon) {
    return {
      action: 'Removed Pokemon',
      pokemon: pokemon,
      message: `${pokemon} has been removed from your team`
    };
  }

  /**
   * Simulate updating a Pokemon's moveset
   */
  updateMoveset(pokemon, moves) {
    return {
      action: 'Updated Moveset',
      pokemon: pokemon,
      moves: moves,
      message: `Updated ${pokemon}'s moveset`
    };
  }

  /**
   * Simulate updating a Pokemon's held item
   */
  updateHeldItem(pokemon, item) {
    return {
      action: 'Updated Held Item',
      pokemon: pokemon,
      item: item,
      message: `${pokemon} is now holding ${item}`
    };
  }

  /**
   * Simulate team analysis
   */
  analyzeTeam(team) {
    return {
      action: 'Analyzed Team',
      teamSize: team.length,
      team: team,
      message: `Analyzed team with ${team.length} Pokemon`
    };
  }

  /**
   * Get execution log
   */
  getExecutionLog() {
    return this.executionLog;
  }

  /**
   * Clear execution log
   */
  clearLog() {
    this.executionLog = [];
  }
}

module.exports = new ActionExecutor();

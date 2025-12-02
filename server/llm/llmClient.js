/**
 * LLM Integration Module
 * Handles communication with OpenAI API
 */

const { OpenAI } = require('openai');
const logger = require('../utils/logger');
const { validateLLMOutput } = require('../utils/validation');
const RateLimiter = require('../utils/rateLimiter');

class LLMClient {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    this.rateLimiter = new RateLimiter(60, 900000); // 60 requests per 15 minutes
    this.maxRetries = 3;
  }

  /**
   * Send a prompt to the LLM and get a response
   * @param {string} prompt - The prompt to send
   * @returns {Promise<string>} - The LLM response
   */
  async sendPrompt(prompt) {
    // Check rate limiting
    if (!this.rateLimiter.isAllowed()) {
      const resetTime = this.rateLimiter.getResetTime();
      const error = new Error('Rate limit exceeded');
      error.status = 429;
      error.resetTime = resetTime;
      throw error;
    }

    logger.info(`Sending prompt to LLM (model: ${this.model})`);

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a Pokemon team building expert. Provide concise, actionable recommendations for Pokemon teams.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        const content = response.choices[0]?.message?.content;

        // Validate LLM output
        const validation = validateLLMOutput(content);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        logger.info('LLM response received successfully');
        return content;

      } catch (error) {
        lastError = error;
        logger.warn(`Attempt ${attempt}/${this.maxRetries} failed: ${error.message}`);

        if (attempt < this.maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    logger.error(`Failed to get LLM response after ${this.maxRetries} attempts`);
    const error = new Error(`LLM API error: ${lastError.message}`);
    error.status = 500;
    throw error;
  }

  /**
   * Generate team recommendations
   * @param {string[]} currentTeam - Current Pokemon on the team
   * @param {string} strategy - User's strategy request
   * @returns {Promise<string>} - Team recommendations
   */
  async generateTeamRecommendations(currentTeam, strategy) {
    const teamString = currentTeam.length > 0 ? currentTeam.join(', ') : 'empty';
    
    const prompt = `
I need help building a Pokemon team. Here's my current team (${currentTeam.length}/6): ${teamString}

My strategy request: ${strategy}

Please provide comprehensive recommendations including:
1. 1-3 additional Pokemon to complete my team (if needed) based on type coverage and synergy
2. For EACH Pokemon in the final team:
   - Optimal 4-move moveset (with move types and coverage)
   - Best held item with explanation
   - How this Pokemon fits into the overall team strategy
   - Synergy with other team members (type coverage, support abilities, etc.)
3. Overall team analysis including:
   - Type coverage strengths and weaknesses
   - How team members synergize with each other
   - Key strategic advantages
   - Specific usage tips

Format your response as JSON with this structure:
{
  "recommendations": {
    "suggestedPokemon": ["pokemon1", "pokemon2"],
    "teamComposition": [
      {
        "name": "pokemon_name",
        "role": "attacker/defender/support/etc",
        "moves": [
          {"name": "move1", "type": "Fire", "purpose": "primary damage"},
          {"name": "move2", "type": "Normal", "purpose": "coverage"}
        ],
        "heldItem": "item_name",
        "itemReasoning": "explanation of why this item",
        "reasoning": "why this pokemon is good for the team",
        "synergy": ["works well with pokemon_a because...", "covers weakness of pokemon_b"]
      }
    ],
    "teamStrategy": "detailed explanation of overall team strategy and how members work together",
    "typeCoverage": {
      "strengths": ["type1", "type2"],
      "weaknesses": ["type3"],
      "coverage": "explanation of type matchups"
    },
    "synergy": "detailed analysis of team synergies and how pokemon support each other",
    "advice": [
      "specific tactical tip 1",
      "specific tactical tip 2",
      "specific tactical tip 3"
    ]
  }
}

Make sure the JSON is valid and complete.`;

    const response = await this.sendPrompt(prompt);
    return response;
  }

  /**
   * Analyze a team's strengths and weaknesses
   * @param {string[]} team - Pokemon on the team
   * @returns {Promise<string>} - Team analysis
   */
  async analyzeTeam(team) {
    const teamString = team.join(', ');

    const prompt = `
Analyze this Pokemon team: ${teamString}

Please provide:
1. Type coverage analysis
2. Strengths and weaknesses
3. Any obvious gaps
4. Recommendations for improvement

Format as a clear, organized response.`;

    const response = await this.sendPrompt(prompt);
    return response;
  }

  getRemainingRequests() {
    return this.rateLimiter.getRemainingRequests();
  }
}

module.exports = new LLMClient();

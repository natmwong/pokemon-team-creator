/**
 * Input validation utilities
 */

const validateTeamRequest = (team, strategy) => {
  const errors = [];

  // Validate team array
  if (!Array.isArray(team)) {
    errors.push('Team must be an array');
  } else if (team.length > 6) {
    errors.push('Team cannot have more than 6 Pokemon');
  } else if (team.length < 0) {
    errors.push('Team cannot have negative Pokemon');
  }

  // Validate each Pokemon in team
  if (Array.isArray(team)) {
    team.forEach((pokemon, index) => {
      if (typeof pokemon !== 'string' || pokemon.trim() === '') {
        errors.push(`Pokemon ${index} must be a non-empty string`);
      }
      if (pokemon.length > 100) {
        errors.push(`Pokemon ${index} name is too long`);
      }
    });
  }

  // Validate strategy string
  if (!strategy) {
    errors.push('Strategy request is required');
  } else if (typeof strategy !== 'string') {
    errors.push('Strategy must be a string');
  } else if (strategy.trim() === '') {
    errors.push('Strategy cannot be empty');
  } else if (strategy.length > 1000) {
    errors.push('Strategy request is too long (max 1000 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLLMOutput = (output) => {
  if (!output) {
    return {
      isValid: false,
      error: 'LLM returned empty output'
    };
  }

  if (typeof output !== 'string') {
    return {
      isValid: false,
      error: 'LLM output must be a string'
    };
  }

  // Check for common error patterns
  if (output.toLowerCase().includes('error') && output.toLowerCase().includes('could not')) {
    return {
      isValid: false,
      error: 'LLM encountered an error processing the request'
    };
  }

  return { isValid: true };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially harmful characters
  return input
    .trim()
    .substring(0, 1000) // Max length
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\n{3,}/g, '\n\n'); // Limit newlines
};

module.exports = {
  validateTeamRequest,
  validateLLMOutput,
  sanitizeInput
};

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 429) {
      error.message = 'Rate limit exceeded. Please wait before making another request.';
    }
    return Promise.reject(error);
  }
);

export const pokemonAPI = {
  getAllPokemon: () => client.get('/pokemon'),
  searchPokemon: (name) => client.get(`/pokemon/search/${name}`),
  getPokemon: (id) => client.get(`/pokemon/${id}`)
};

export const teamAPI = {
  generateTeam: (team, strategy, signal) => 
    client.post('/team/generate', { team, strategy }, { signal }),
  analyzeTeam: (team) => 
    client.post('/team/analyze', { team }),
  suggestMovesets: (pokemon) => 
    client.post('/team/suggest-movesets', { pokemon }),
  suggestItems: (pokemon) => 
    client.post('/team/suggest-items', { pokemon })
};

export default client;

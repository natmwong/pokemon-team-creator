import React, { useState, useEffect } from 'react';
import PokemonPicker from './components/PokemonPicker';
import TeamBuilder from './components/TeamBuilder';
import RecommendationsModal from './components/RecommendationsModal';
import Login from './components/Login';
import SignUp from './components/SignUp';
import SaveTeamModal from './components/SaveTeamModal';
import TeamsPage from './components/TeamsPage';
import NavBar from './components/NavBar';
import { teamAPI } from './api';
import { onAuthChange, logout } from './services/authService';
import { saveTeam } from './services/teamService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup'
  const [currentPage, setCurrentPage] = useState('builder'); // 'builder', 'teams'
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [strategy, setStrategy] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [abortController, setAbortController] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleRemovePokemon = (index) => {
    setSelectedPokemon(selectedPokemon.filter((_, i) => i !== index));
  };

  const handleCloseModal = () => {
    // Abort the ongoing request if it exists
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setRecommendations(null);
    setLoading(false);
    setError(null);
  };

  const handleStrategyChange = (newStrategy) => {
    setStrategy(newStrategy);
  };

  const handleGenerateTeam = async (teamStrategy) => {
    try {
      setLoading(true);
      setError(null);

      // Create abort controller for this request
      const controller = new AbortController();
      setAbortController(controller);

      // Get Pokemon names
      const pokemonNames = selectedPokemon.map(p => p.name);

      // Call API to generate team with abort signal
      const response = await teamAPI.generateTeam(pokemonNames, teamStrategy, controller.signal);

      if (response.data.success) {
        setRecommendations(response.data.recommendations);
        setTeamName('');
        setTeamDescription('');
      } else {
        setError(response.data.error || 'Failed to generate team');
      }
    } catch (err) {
      console.error('Error generating team:', err);
      // Don't show error if request was aborted
      if (err.name === 'AbortError') {
        console.log('Request cancelled by user');
      } else if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please wait before trying again.');
      } else {
        setError(err.message || 'Failed to generate team recommendations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTeam = async () => {
    if (!user) {
      setError('Please log in to save teams');
      return;
    }

    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await saveTeam(user.uid, {
        name: teamName,
        description: teamDescription,
        pokemon: selectedPokemon,
        strategy: strategy,
        recommendations: recommendations
      });

      setError(null);
      alert('Team saved successfully!');
      setTeamName('');
      setTeamDescription('');
      setShowSaveModal(false);
    } catch (err) {
      setError(err.message || 'Failed to save team');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTeam = (team) => {
    setSelectedPokemon(team.pokemon || []);
    setStrategy(team.strategy || '');
    setRecommendations(team.recommendations || null);
    setTeamName(team.name);
    setTeamDescription(team.description || '');
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setSelectedPokemon([]);
      setStrategy('');
      setRecommendations(null);
      setTeamName('');
      setTeamDescription('');
      setCurrentPage('builder');
      setShowSaveModal(false);
    } catch (err) {
      setError(err.message || 'Failed to logout');
    }
  };

return (
    <div className="app">
      {user && (
        <NavBar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <main className="app-main">
        {!user ? (
          <>
            {authMode === 'login' ? (
              <Login
                onLoginSuccess={() => setAuthMode('login')}
                onSwitchToSignup={() => setAuthMode('signup')}
              />
            ) : (
              <SignUp
                onSignupSuccess={() => setAuthMode('login')}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
          </>
        ) : currentPage === 'builder' ? (
          <div className="app-container">
            <div className="left-panel">
              <PokemonPicker
                selectedPokemon={selectedPokemon}
                onSelect={handlePokemonSelect}
                maxTeamSize={6}
              />
            </div>

            <div className="right-panel">
              <TeamBuilder
                selectedPokemon={selectedPokemon}
                onStrategyChange={handleStrategyChange}
                onGenerateTeam={handleGenerateTeam}
                onRemovePokemon={handleRemovePokemon}
                loading={loading}
              />

              {error && <div className="error-banner">{error}</div>}
            </div>
          </div>
        ) : (
          <TeamsPage
            userId={user.uid}
            onLoadTeam={handleLoadTeam}
            onSwitchToBuilder={() => setCurrentPage('builder')}
          />
        )}
      </main>

      {/* Recommendations Modal */}
      <RecommendationsModal
        recommendations={recommendations}
        loading={loading}
        error={error}
        onClose={handleCloseModal}
        onSaveClick={() => setShowSaveModal(true)}
      />

      {/* Save Team Modal */}
      {showSaveModal && recommendations && (
        <SaveTeamModal
          teamName={teamName}
          teamDescription={teamDescription}
          onNameChange={setTeamName}
          onDescriptionChange={setTeamDescription}
          onSave={handleSaveTeam}
          onClose={() => setShowSaveModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;

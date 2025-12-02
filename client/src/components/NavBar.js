import React from 'react';
import pokeballIcon from '../pokeball.png';
import '../styles/NavBar.css';

const NavBar = ({ currentPage, onPageChange, user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={pokeballIcon} alt="Pokéball" className="navbar-pokeball" />
          <h2>PokéAI</h2>
        </div>

        {user && (
          <div className="navbar-center">
            <button
              className={`nav-link ${currentPage === 'builder' ? 'active' : ''}`}
              onClick={() => onPageChange('builder')}
            >
              🛠️ Team Builder
            </button>
            <button
              className={`nav-link ${currentPage === 'teams' ? 'active' : ''}`}
              onClick={() => onPageChange('teams')}
            >
              📚 My Teams
            </button>
          </div>
        )}

        {user && (
          <div className="navbar-right">
            <span className="user-email">👤 {user.displayName || user.email}</span>
            <button onClick={onLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

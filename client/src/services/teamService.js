/**
 * Team Database Service
 * Handles saving, loading, updating, and deleting team compositions in Firestore
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const TEAMS_COLLECTION = 'teams';

/**
 * Save a new team composition
 * @param {string} userId - User's UID
 * @param {Object} teamData - Team data including pokemon, strategy, recommendations
 * @returns {Promise<Object>} - Saved team with ID
 */
export const saveTeam = async (userId, teamData) => {
  try {
    const teamRef = await addDoc(collection(db, TEAMS_COLLECTION), {
      userId,
      name: teamData.name || `Team ${new Date().toLocaleDateString()}`,
      description: teamData.description || '',
      pokemon: teamData.pokemon || [],
      strategy: teamData.strategy || '',
      recommendations: teamData.recommendations || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: teamRef.id,
      ...teamData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    throw {
      code: error.code,
      message: 'Failed to save team'
    };
  }
};

/**
 * Get all teams for a user
 * @param {string} userId - User's UID
 * @returns {Promise<Array>} - Array of user's teams
 */
export const getUserTeams = async (userId) => {
  try {
    const q = query(
      collection(db, TEAMS_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const teams = [];

    querySnapshot.forEach((doc) => {
      teams.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    // Sort by most recent first
    return teams.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch (error) {
    throw {
      code: error.code,
      message: 'Failed to load teams'
    };
  }
};

/**
 * Update an existing team
 * @param {string} teamId - Team document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateTeam = async (teamId, updates) => {
  try {
    const teamRef = doc(db, TEAMS_COLLECTION, teamId);
    await updateDoc(teamRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw {
      code: error.code,
      message: 'Failed to update team'
    };
  }
};

/**
 * Delete a team
 * @param {string} teamId - Team document ID
 * @returns {Promise<void>}
 */
export const deleteTeam = async (teamId) => {
  try {
    await deleteDoc(doc(db, TEAMS_COLLECTION, teamId));
  } catch (error) {
    throw {
      code: error.code,
      message: 'Failed to delete team'
    };
  }
};

export default {
  saveTeam,
  getUserTeams,
  updateTeam,
  deleteTeam
};

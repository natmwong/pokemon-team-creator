/**
 * Authentication Service
 * Handles user signup, login, logout, and password reset using Firebase Auth
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password (min 6 chars)
 * @param {string} displayName - User's display name
 * @returns {Promise<Object>} - User object
 */
export const signUp = async (email, password, displayName) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name
    await updateProfile(user, { displayName });

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
  } catch (error) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User object
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
  } catch (error) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw {
      code: error.code,
      message: 'Failed to logout'
    };
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Set up listener for auth state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} - Unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Get user-friendly error messages from Firebase error codes
 * @param {string} errorCode - Firebase error code
 * @returns {string} - User-friendly error message
 */
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/invalid-credential': 'Invalid email or password.'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

export default {
  signUp,
  login,
  logout,
  resetPassword,
  onAuthChange
};

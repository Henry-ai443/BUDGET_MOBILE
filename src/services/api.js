import { API_BASE_URL } from '../config/api';
import * as SecureStore from 'expo-secure-store';

/**
 * Centralized API client for all backend communications
 * Handles JWT token injection and error handling
 */

const getAuthHeaders = async () => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  } catch (error) {
    console.error('Error retrieving token:', error);
    return { 'Content-Type': 'application/json' };
  }
};

/**
 * Fetch transactions for current user
 * @param {number} page - Page number (default 1)
 * @param {number} limit - Items per page (default 50)
 * @returns {Promise} - { transactions, total }
 */
export const fetchTransactions = async (page = 1, limit = 50) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/transactions?page=${page}&limit=${limit}&sort=-date`,
      { method: 'GET', headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch transactions error:', error);
    throw error;
  }
};

/**
 * Create a new transaction
 * @param {Object} transaction - { type, amount, category, note, date }
 * @returns {Promise} - Created transaction
 */
export const createTransaction = async (transaction) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
};

/**
 * Delete a transaction
 * @param {string} transactionId - ID of transaction to delete
 * @returns {Promise}
 */
export const deleteTransaction = async (transactionId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete transaction error:', error);
    throw error;
  }
};

/**
 * Fetch AI insights for spending
 * @param {number} days - Number of days to analyze (default 30)
 * @returns {Promise} - { summary, ai }
 */
export const fetchInsights = async (days = 30) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/insights?days=${days}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch insights error:', error);
    throw error;
  }
};

/**
 * Logout user (clear token)
 * @returns {Promise}
 */
export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync('userToken');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

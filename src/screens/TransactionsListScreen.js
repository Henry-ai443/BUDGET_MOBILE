import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTransactions, logout } from '../services/api';
import theme from '../theme/theme';
import styles from '../styles/TransactionsListStyles';

/**
 * Transactions List Screen
 * Displays all user transactions in reverse chronological order
 * Features: Pull-to-refresh, empty state, and floating action button
 */
export default function TransactionsListScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  /**
   * Load transactions from API
   */
  const loadTransactions = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTransactions(page, 50);
      setTransactions(data.transactions || []);
    } catch (err) {
      setError('Failed to load transactions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  /**
   * Pull-to-refresh handler
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    try {
      const data = await fetchTransactions(1, 50);
      setTransactions(data.transactions || []);
      setError(null);
    } catch (err) {
      setError('Failed to refresh transactions.');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  /**
   * Format currency display
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  /**
   * Format date to readable format
   */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Render individual transaction item
   */
  const renderTransaction = ({ item }) => {
    const isIncome = item.type === 'income';
    const amountColor = isIncome ? theme.colors.green : theme.colors.red;

    return (
      <TouchableOpacity
        style={styles.transactionCard}
        onLongPress={() => {
          Alert.alert(
            'Delete Transaction?',
            'This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => handleDeleteTransaction(item._id),
              },
            ]
          );
        }}
      >
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          {item.note && <Text style={styles.transactionNote}>{item.note}</Text>}
        </View>

        <View style={styles.transactionRight}>
          <Text style={[styles.transactionAmount, { color: amountColor }]}>
            {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
          </Text>
          <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Handle transaction deletion
   */
  const handleDeleteTransaction = async (transactionId) => {
    try {
      // TODO: Implement delete via API
      // For now, filter from local state
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      Alert.alert('Success', 'Transaction deleted');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete transaction');
      console.error(err);
    }
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Transactions Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start tracking your spending by adding your first transaction
      </Text>
    </View>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadTransactions}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.green} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity
          onPress={async () => {
            await logout();
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      {error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.green}
            />
          }
          contentContainerStyle={
            transactions.length === 0 ? styles.listContainerEmpty : styles.listContainer
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransactionTab')}
      >
        <Text style={styles.fabText}>➕</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { fetchInsights } from '../services/api';
import theme from '../theme/theme';
import styles from '../styles/AIInsightsStyles';

/**
 * AI Insights Screen
 * Displays AI-powered financial insights and recommendations
 * Shows spending patterns, warnings, and savings opportunities
 */
export default function AIInsightsScreen({ navigation }) {
  const [insightData, setInsightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  /**
   * Load insights from API
   */
  const loadInsights = useCallback(async (days) => {
    try {
      setError(null);
      const data = await fetchInsights(days);
      setInsightData(data);
    } catch (err) {
      setError('Failed to load insights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Pull-to-refresh handler
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchInsights(selectedPeriod);
      setInsightData(data);
      setError(null);
    } catch (err) {
      setError('Failed to refresh insights.');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [selectedPeriod]);

  // Load insights on mount and when period changes
  useEffect(() => {
    setLoading(true);
    loadInsights(selectedPeriod);
  }, [selectedPeriod, loadInsights]);

  // Refresh insights when screen gains focus (after transaction deletion)
  useFocusEffect(
    useCallback(() => {
      loadInsights(selectedPeriod);
    }, [selectedPeriod, loadInsights])
  );

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
   * Get insight icon based on type (heuristic)
   */
  const getInsightIcon = (insight) => {
    const lower = insight.toLowerCase();
    if (lower.includes('good') || lower.includes('improved') || lower.includes('great')) {
      return '✅';
    }
    if (
      lower.includes('warning') ||
      lower.includes('overspent') ||
      lower.includes('exceeded')
    ) {
      return '⚠️';
    }
    if (lower.includes('save') || lower.includes('opportunity')) {
      return '💡';
    }
    return '📊';
  };

  /**
   * Get insight color based on sentiment
   */
  const getInsightColor = (insight) => {
    const lower = insight.toLowerCase();
    if (lower.includes('good') || lower.includes('improved')) {
      return theme.colors.green;
    }
    if (lower.includes('warning') || lower.includes('overspent')) {
      return theme.colors.red;
    }
    return theme.colors.gray600;
  };

  /**
   * Render summary card
   */
  const renderSummary = () => {
    const summary = insightData?.summary;
    if (!summary) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Summary (Last {summary.days} Days)</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryAmount}>
              {formatCurrency(summary.total_spent)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryAmount}>{summary.transaction_count}</Text>
          </View>
        </View>

        {/* Top Categories */}
        {summary.by_category && summary.by_category.length > 0 && (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionSubtitle}>Top Categories</Text>
            {summary.by_category.slice(0, 3).map((cat, index) => (
              <View key={index} style={styles.categoryRow}>
                <Text style={styles.categoryName}>{cat.category}</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(cat.total)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  /**
   * Render AI insights
   */
  const renderAIInsights = () => {
    const ai = insightData?.ai;
    if (!ai) return null;

    // Handle both array format and raw text format
    const insights = Array.isArray(ai.insights) ? ai.insights : [];
    const actions = Array.isArray(ai.actions) ? ai.actions : [];
    const rawText = ai.raw;

    // If we have raw text, show it
    if (rawText && insights.length === 0 && actions.length === 0) {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Analysis</Text>
          <Text style={styles.rawInsightText}>{rawText}</Text>
        </View>
      );
    }

    return (
      <>
        {/* Insights Section */}
        {insights.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💡 Key Insights</Text>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Text style={styles.insightIcon}>{getInsightIcon(insight)}</Text>
                <Text
                  style={[styles.insightText, { color: getInsightColor(insight) }]}
                >
                  {insight}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Recommendations Section */}
        {actions.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Recommendations</Text>
            {actions.map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <Text style={styles.actionBullet}>•</Text>
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Data Available</Text>
      <Text style={styles.emptySubtitle}>
        Add some transactions to get personalized insights
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('AddTransactionTab')}
      >
        <Text style={styles.emptyButtonText}>Add First Transaction</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !insightData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.green} />
          <Text style={styles.loadingText}>Analyzing your spending...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Insights</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {[7, 30, 90].map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.periodButton,
              selectedPeriod === days && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(days)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === days && styles.periodButtonTextActive,
              ]}
            >
              {days}d
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {error ? (
        renderErrorState()
      ) : insightData &&
        (insightData.summary?.transaction_count > 0 || insightData.ai) ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.green}
            />
          }
        >
          {renderSummary()}
          {renderAIInsights()}

          {/* Footer Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💬 Insights are updated daily. Add more transactions for better recommendations.
            </Text>
          </View>
        </ScrollView>
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
}

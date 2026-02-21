import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SectionList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { fetchTransactions } from '../services/api';
import theme from '../theme/theme';
import styles from '../styles/SpendingBreakdownStyles';

/**
 * Spending Breakdown Screen
 * Detailed analysis of spending patterns
 * - By category with percentages
 * - By type (expense/income)
 * - Time period comparison
 * - Highest and lowest spending days
 */
export default function SpendingBreakdownScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [breakdownData, setBreakdownData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('category');

  const screenWidth = Dimensions.get('window').width - theme.spacing.md * 2;

  /**
   * Calculate detailed breakdown
   */
  const calculateBreakdown = useCallback((txns) => {
    if (!txns || txns.length === 0) return null;

    // By Category
    const byCategory = {};
    let totalExpense = 0;

    // By Type
    let totalIncome = 0;
    let totalExp = 0;

    // By Day
    const byDay = {};
    const highestDays = [];
    const lowestDays = [];

    txns.forEach((tx) => {
      const amount = parseFloat(tx.amount) || 0;
      const category = tx.category || 'Other';

      if (tx.type === 'expense') {
        totalExp += amount;
        byCategory[category] = (byCategory[category] || 0) + amount;

        // By day
        try {
          const date = new Date(tx.date);
          const dayKey = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          byDay[dayKey] = (byDay[dayKey] || 0) + amount;
        } catch (e) {
          // Skip invalid dates
        }
      } else {
        totalIncome += amount;
      }
    });

    totalExpense = totalExp;

    // Category breakdown with percentages
    const categoryList = Object.entries(byCategory)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpense > 0 ? ((value / totalExpense) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    // Daily breakdown
    const dailyList = Object.entries(byDay)
      .map(([day, value]) => ({ day, value }))
      .sort((a, b) => b.value - a.value);

    // Highest and lowest days
    const highestDay = dailyList[0] || { day: 'N/A', value: 0 };
    const lowestDay = dailyList[dailyList.length - 1] || { day: 'N/A', value: 0 };

    // Average spending
    const avgDaily = totalExpense / (dailyList.length || 1);

    // Chart data
    const barChartData = {
      labels: categoryList.slice(0, 5).map((c) => c.name.substring(0, 10)),
      datasets: [
        {
          data: categoryList.slice(0, 5).map((c) => c.value),
        },
      ],
    };

    return {
      categoryList,
      dailyList: dailyList.slice(0, 7),
      highestDay,
      lowestDay,
      avgDaily,
      totalExpense,
      totalIncome,
      barChart: barChartData,
      transactionCount: txns.length,
    };
  }, []);

  /**
   * Load transactions and calculate breakdown
   */
  const loadBreakdown = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTransactions(1, 150);
      const txns = data.transactions || [];
      setTransactions(txns);

      const calculated = calculateBreakdown(txns);
      setBreakdownData(calculated);
    } catch (err) {
      setError('Failed to load breakdown data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [calculateBreakdown]);

  /**
   * Pull-to-refresh handler
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchTransactions(1, 150);
      const txns = data.transactions || [];
      setTransactions(txns);

      const calculated = calculateBreakdown(txns);
      setBreakdownData(calculated);
      setError(null);
    } catch (err) {
      setError('Failed to refresh breakdown.');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [calculateBreakdown]);

  useEffect(() => {
    loadBreakdown();
  }, [loadBreakdown]);

  // Refresh breakdown when screen gains focus (after transaction deletion)
  useFocusEffect(
    useCallback(() => {
      loadBreakdown();
    }, [loadBreakdown])
  );

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  /**
   * Get color for percentage (green if low, red if high)
   */
  const getPercentageColor = (percentage) => {
    if (percentage > 50) return theme.colors.red;
    if (percentage > 30) return '#ffc107';
    return theme.colors.green;
  };

  /**
   * Render key metrics
   */
  const renderMetrics = () => {
    if (!breakdownData) return null;

    return (
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Avg Daily</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(breakdownData.avgDaily)}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Highest Day</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(breakdownData.highestDay.value)}
          </Text>
          <Text style={styles.metricSubtext}>{breakdownData.highestDay.day}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Transactions</Text>
          <Text style={styles.metricValue}>{breakdownData.transactionCount}</Text>
        </View>
      </View>
    );
  };

  /**
   * Render category breakdown
   */
  const renderCategoryBreakdown = () => {
    if (!breakdownData || breakdownData.categoryList.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No expense data available</Text>
        </View>
      );
    }

    return (
      <>
        {/* Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top 5 Categories</Text>
          <BarChart
            data={breakdownData.barChart}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.white,
              backgroundGradientFrom: theme.colors.white,
              backgroundGradientTo: theme.colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(85, 85, 85, ${opacity})`,
              style: { borderRadius: 8 },
              barPercentage: 0.7,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 8,
            }}
          />
        </View>

        {/* Detailed List */}
        <View style={styles.listCard}>
          <Text style={styles.listTitle}>All Categories</Text>
          {breakdownData.categoryList.map((cat, index) => (
            <View key={index} style={styles.categoryListItem}>
              <View style={styles.categoryLeft}>
                <Text style={styles.categoryItemName}>{cat.name}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${cat.percentage}%`,
                        backgroundColor: getPercentageColor(cat.percentage),
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.categoryRight}>
                <Text style={[styles.categoryPercentage, { color: getPercentageColor(cat.percentage) }]}>
                  {cat.percentage}%
                </Text>
                <Text style={styles.categoryItemAmount}>{formatCurrency(cat.value)}</Text>
              </View>
            </View>
          ))}
        </View>
      </>
    );
  };

  /**
   * Render daily breakdown
   */
  const renderDailyBreakdown = () => {
    if (!breakdownData || breakdownData.dailyList.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No daily data available</Text>
        </View>
      );
    }

    return (
      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Top Spending Days</Text>
        {breakdownData.dailyList.map((day, index) => (
          <View key={index} style={styles.dailyListItem}>
            <View style={styles.dailyLeft}>
              <Text style={styles.dayNumber}>{index + 1}</Text>
              <Text style={styles.dayName}>{day.day}</Text>
            </View>
            <Text style={styles.dayAmount}>{formatCurrency(day.value)}</Text>
          </View>
        ))}
      </View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Data Available</Text>
      <Text style={styles.emptySubtitle}>
        Your spending breakdown will appear here once you add transactions
      </Text>
    </View>
  );

  if (loading && !breakdownData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.green} />
          <Text style={styles.loadingText}>Analyzing spending...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!breakdownData) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spending Breakdown</Text>
      </View>

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
        {/* Metrics */}
        {renderMetrics()}

        {/* Filter Buttons */}
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'category' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('category')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'category' && styles.filterButtonTextActive,
              ]}
            >
              By Category
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'daily' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('daily')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'daily' && styles.filterButtonTextActive,
              ]}
            >
              By Day
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {selectedFilter === 'category'
          ? renderCategoryBreakdown()
          : renderDailyBreakdown()}

        {/* Footer Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 Swipe to compare different spending patterns
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

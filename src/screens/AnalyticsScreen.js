import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { fetchTransactions } from '../services/api';
import theme from '../theme/theme';
import styles from '../styles/AnalyticsStyles';

/**
 * Analytics Dashboard Screen
 * Displays spending analytics with various charts
 * - Monthly trend (line chart)
 * - Category breakdown (pie chart)
 * - Expense vs Income (bar chart)
 */
export default function AnalyticsScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const screenWidth = Dimensions.get('window').width - theme.spacing.md * 2;

  /**
   * Calculate spending data from transactions
   */
  const calculateChartData = useCallback((txns) => {
    if (!txns || txns.length === 0) return null;

    // Group by category
    const byCategory = {};
    let totalExpense = 0;
    let totalIncome = 0;

    txns.forEach((tx) => {
      const category = tx.category || 'Other';
      const amount = parseFloat(tx.amount) || 0;

      if (tx.type === 'expense') {
        totalExpense += amount;
        byCategory[category] = (byCategory[category] || 0) + amount;
      } else {
        totalIncome += amount;
      }
    });

    // Pie chart data (top 6 categories)
    const categoryArray = Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const pieChartData = categoryArray.map((cat) => ({
      name: cat.name,
      value: cat.value,
      color: theme.colors.green,
      legendFontColor: theme.colors.black,
      legendFontSize: 12,
    }));

    // Add colors to pie chart
    const colors = [
      '#28a745',
      '#dc3545',
      '#ffc107',
      '#17a2b8',
      '#6f42c1',
      '#fd7e14',
    ];
    pieChartData.forEach((item, index) => {
      item.color = colors[index % colors.length];
    });

    // Monthly trend data (last 6 months)
    const monthlyData = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });
      monthlyData[monthKey] = 0;
    }

    txns.forEach((tx) => {
      if (tx.type === 'expense') {
        try {
          const date = new Date(tx.date);
          const monthKey = date.toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
          });
          if (monthlyData.hasOwnProperty(monthKey)) {
            monthlyData[monthKey] += parseFloat(tx.amount) || 0;
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });

    const lineChartData = {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          data: Object.values(monthlyData),
          color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };

    // Bar chart data (expense vs income)
    const barChartData = {
      labels: ['Expense', 'Income'],
      datasets: [
        {
          data: [totalExpense, totalIncome],
        },
      ],
    };

    return {
      pieChart: pieChartData,
      lineChart: lineChartData,
      barChart: barChartData,
      totalExpense,
      totalIncome,
      categoryBreakdown: categoryArray,
    };
  }, []);

  /**
   * Load transactions and calculate chart data
   */
  const loadAnalytics = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTransactions(1, 100);
      const txns = data.transactions || [];
      setTransactions(txns);

      const calculated = calculateChartData(txns);
      setChartData(calculated);
    } catch (err) {
      setError('Failed to load analytics data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [calculateChartData]);

  /**
   * Pull-to-refresh handler
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchTransactions(1, 100);
      const txns = data.transactions || [];
      setTransactions(txns);

      const calculated = calculateChartData(txns);
      setChartData(calculated);
      setError(null);
    } catch (err) {
      setError('Failed to refresh analytics.');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [calculateChartData]);

  // Load analytics on mount
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

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
   * Render summary cards
   */
  const renderSummaryCards = () => {
    if (!chartData) return null;

    const balance = chartData.totalIncome - chartData.totalExpense;

    return (
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.green }]}>
            {formatCurrency(chartData.totalIncome)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Expense</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.red }]}>
            {formatCurrency(chartData.totalExpense)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[styles.summaryValue, { color: balance >= 0 ? theme.colors.green : theme.colors.red }]}>
            {formatCurrency(balance)}
          </Text>
        </View>
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
        Add transactions to see your spending analytics
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.emptyButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !chartData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.green} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!chartData) {
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
        <Text style={styles.headerTitle}>Analytics</Text>
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
        {/* Summary Cards */}
        {renderSummaryCards()}

        {/* Line Chart - Monthly Trend */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📈 Monthly Spending Trend</Text>
          <LineChart
            data={chartData.lineChart}
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
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: theme.colors.green,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 8,
            }}
            bezier
          />
        </View>

        {/* Pie Chart - Category Breakdown */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>🥧 Spending by Category</Text>
          <PieChart
            data={chartData.pieChart}
            width={screenWidth}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            style={{
              marginVertical: 8,
              borderRadius: 8,
            }}
          />
        </View>

        {/* Bar Chart - Expense vs Income */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📊 Expense vs Income</Text>
          <BarChart
            data={chartData.barChart}
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

        {/* Category Breakdown List */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>🎯 Top Categories</Text>
          {chartData.categoryBreakdown.map((cat, index) => {
            const percentage = (
              (cat.value / chartData.totalExpense) *
              100
            ).toFixed(1);
            return (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryNameContainer}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryPercentage}>{percentage}%</Text>
                </View>
                <Text style={styles.categoryAmount}>{formatCurrency(cat.value)}</Text>
              </View>
            );
          })}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 View detailed breakdowns in the Insights tab for AI-powered recommendations
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}








































































































































































































































































































































































































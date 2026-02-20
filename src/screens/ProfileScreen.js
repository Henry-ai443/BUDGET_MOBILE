import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../services/api';
import theme from '../theme/theme';
import styles from '../styles/ProfileStyles';

/**
 * Profile Screen
 * Displays user information and provides logout functionality
 */
export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await logout();
            navigation.navigate('Login');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
            console.error(error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>User Profile</Text>
            <Text style={styles.userEmail}>Manage your account</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('TransactionsTab')}
          >
            <Text style={styles.settingsIcon}>📊</Text>
            <Text style={styles.settingsLabel}>View Transactions</Text>
            <Text style={styles.settingsArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('InsightsTab')}
          >
            <Text style={styles.settingsIcon}>💡</Text>
            <Text style={styles.settingsLabel}>Financial Insights</Text>
            <Text style={styles.settingsArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('AddTransactionTab')}
          >
            <Text style={styles.settingsIcon}>➕</Text>
            <Text style={styles.settingsLabel}>Add Transaction</Text>
            <Text style={styles.settingsArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Features</Text>
            <Text style={styles.infoValue}>✅ Budgeting, ✅ AI Insights</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.red} size="small" />
          ) : (
            <Text style={styles.logoutButtonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
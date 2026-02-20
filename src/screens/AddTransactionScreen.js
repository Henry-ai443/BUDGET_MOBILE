import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Picker,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createTransaction } from '../services/api';
import theme from '../theme/theme';
import styles from '../styles/AddTransactionStyles';

/**
 * Add Transaction Screen
 * Form to create new income or expense transactions
 * Includes validation, loading state, and error handling
 */
export default function AddTransactionScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Common expense categories
  const expenseCategories = [
    'Food',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Rent',
    'Other',
  ];

  // Common income categories
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Other'];

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const newErrors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const transactionData = {
        type,
        amount: parseFloat(amount),
        category,
        note: note.trim() || undefined,
        date: new Date().toISOString(),
      };

      const response = await createTransaction(transactionData);

      Alert.alert('Success', 'Transaction created successfully', [
        {
          text: 'Add Another',
          onPress: () => {
            setAmount('');
            setCategory(expenseCategories[0]);
            setType('expense');
            setNote('');
            setErrors({});
          },
        },
        {
          text: 'View All',
          onPress: () => navigation.navigate('TransactionsTab'),
        },
      ]);
    } catch (error) {
      const errorMessage = error.message || 'Failed to create transaction';
      Alert.alert('Error', errorMessage);
      console.error('Create transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle type toggle between income/expense
   */
  const handleTypeToggle = (newType) => {
    setType(newType);
    // Reset category to first option when switching type
    const newCategories = newType === 'expense' ? expenseCategories : incomeCategories;
    setCategory(newCategories[0]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={theme.spacing.lg}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Transaction</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Type Toggle */}
        <View style={styles.typeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.typeToggleButton,
              type === 'expense' && styles.typeToggleButtonActive,
            ]}
            onPress={() => handleTypeToggle('expense')}
          >
            <Text
              style={[
                styles.typeToggleText,
                type === 'expense' && styles.typeToggleTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeToggleButton,
              type === 'income' && styles.typeToggleButtonActive,
            ]}
            onPress={() => handleTypeToggle('income')}
          >
            <Text
              style={[
                styles.typeToggleText,
                type === 'income' && styles.typeToggleTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={[styles.inputContainer, errors.amount && styles.inputError]}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={theme.colors.gray400}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              editable={!loading}
            />
          </View>
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        {/* Category Picker */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={[styles.pickerContainer, errors.category && styles.inputError]}>
            <Picker
              selectedValue={category}
              onValueChange={(value) => setCategory(value)}
              enabled={!loading}
              style={styles.picker}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Note Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a description (e.g., Lunch with client)"
            placeholderTextColor={theme.colors.gray400}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            editable={!loading}
            maxLength={200}
          />
          <Text style={styles.charCount}>{note.length}/200</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Add Transaction</Text>
          )}
        </TouchableOpacity>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            💡 Tip: Keep your transactions categorized for better insights
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

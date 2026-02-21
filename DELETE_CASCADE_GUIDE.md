# Transaction Cascade Delete Implementation Guide

## Overview

This document describes the complete cascade delete system implemented in the Budget App. When a user deletes a transaction, it is automatically removed from:

1. ✅ The Transactions List
2. ✅ Analytics Dashboard (charts and calculations)
3. ✅ Spending Breakdown (category analysis and daily breakdown)
4. ✅ AI Insights (recommendations and patterns)
5. ✅ Backend Database

## Architecture

### 1. Delete Initiation (TransactionsListScreen.js)

**Location:** `src/screens/TransactionsListScreen.js` (lines 139-160)

When a user long-presses on a transaction:

```javascript
const handleDeleteTransaction = async (transactionId) => {
  try {
    // 1. Call API to delete from backend
    await deleteTransaction(transactionId);
    
    // 2. Remove from local state immediately (UI feedback)
    setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
    
    Alert.alert('Success', 'Transaction deleted successfully');
  } catch (err) {
    Alert.alert('Error', 'Failed to delete transaction. Please try again.');
    
    // 3. Reload transactions if delete fails (consistency)
    try {
      const data = await fetchTransactions(1, 50);
      setTransactions(data.transactions || []);
    } catch (reloadErr) {
      console.error('Failed to reload transactions:', reloadErr);
    }
  }
};
```

**Key Points:**
- Uses API `deleteTransaction()` from `src/services/api.js`
- Removes transaction from local state immediately for responsive UI
- Falls back to reload if deletion fails (ensures consistency with server)
- Shows user-friendly alerts for success/error

### 2. Backend API Call (src/services/api.js)

**Location:** `src/services/api.js` (lines 72-89)

```javascript
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
```

**Key Points:**
- Calls `DELETE /api/transactions/:id` endpoint
- Includes JWT authorization token via `getAuthHeaders()`
- Throws error if deletion fails
- Removes transaction from backend database

### 3. Automatic Analytics Sync (AnalyticsScreen.js)

**Location:** `src/screens/AnalyticsScreen.js` (lines 187-200)

When user navigates to Analytics tab after deletion:

```javascript
// Refresh analytics when screen gains focus (after transaction deletion)
useFocusEffect(
  useCallback(() => {
    loadAnalytics();
  }, [loadAnalytics])
);
```

**How It Works:**
- `useFocusEffect` hook triggers whenever Analytics screen gains focus
- Calls `loadAnalytics()` which:
  1. Fetches fresh transactions from backend API
  2. Recalculates all charts (Line, Pie, Bar)
  3. Updates summary cards (Income, Expense, Balance)
  4. Removes deleted transaction from all calculations

**Charts Updated:**
- 📈 **Line Chart:** 6-month spending trend (transaction removed from calculations)
- 🥧 **Pie Chart:** Top 6 spending categories (category updated if affected)
- 📊 **Bar Chart:** Expense vs Income comparison (totals recalculated)

### 4. Automatic Breakdown Sync (SpendingBreakdownScreen.js)

**Location:** `src/screens/SpendingBreakdownScreen.js` (lines 167-179)

When user navigates to Breakdown tab after deletion:

```javascript
// Refresh breakdown when screen gains focus (after transaction deletion)
useFocusEffect(
  useCallback(() => {
    loadBreakdown();
  }, [loadBreakdown])
);
```

**How It Works:**
- `useFocusEffect` hook triggers whenever Breakdown screen gains focus
- Calls `loadBreakdown()` which:
  1. Fetches fresh transactions from backend API
  2. Recalculates category breakdown percentages
  3. Updates highest/lowest spending days
  4. Recalculates average daily spending
  5. Removes deleted transaction from all metrics

**Metrics Updated:**
- 💰 Average Daily Spending (recalculated)
- 📅 Highest/Lowest Spending Days (updated)
- 🏷️ Category Breakdown (percentages recalculated)
- 📊 Category Bar Chart (top 5 updated)
- 📋 Detailed Category List (transaction removed)

### 5. Automatic Insights Sync (AIInsightsScreen.js)

**Location:** `src/screens/AIInsightsScreen.js` (lines 63-74)

When user navigates to Insights tab after deletion:

```javascript
// Refresh insights when screen gains focus (after transaction deletion)
useFocusEffect(
  useCallback(() => {
    loadInsights(selectedPeriod);
  }, [selectedPeriod, loadInsights])
);
```

**How It Works:**
- `useFocusEffect` hook triggers whenever Insights screen gains focus
- Calls `loadInsights()` which fetches AI recommendations based on latest transaction data
- Deleted transaction no longer affects AI insights and recommendations

## Data Flow Diagram

```
User Long-Presses Transaction
            ↓
    handleDeleteTransaction()
            ↓
    API: DELETE /transactions/:id
            ↓
    Backend Removes from Database
            ↓
    Local State Updated
            ↓
    Success Alert Shown
            ↓
    ┌─────────────────────────────────────────┐
    │  User Navigates to Different Screen     │
    │  (Analytics, Breakdown, or Insights)    │
    └─────────────────────────────────────────┘
            ↓
    useFocusEffect Triggers
            ↓
    Fresh Data Fetched from API
            ↓
    Calculations Recalculated
            ↓
    UI Updated with Fresh Data
            ↓
    ✅ Deleted Transaction Completely Removed
```

## Error Handling & Consistency

### Scenario 1: Successful Deletion
```
✅ API returns 200 OK
✅ Transaction removed from database
✅ Local state updated immediately
✅ User sees success alert
✅ Next screen navigation triggers refresh
```

### Scenario 2: Deletion Fails
```
❌ API returns error
❌ Local state NOT updated (caught in try-catch)
❌ User sees error alert
✅ Automatic reload of transactions from API
✅ Local state synchronized with server
✅ Consistency maintained
```

### Scenario 3: User Deletes Then Quickly Navigates
```
✅ Delete API call in progress
✅ User navigates away from Transactions
✅ Focus listener on new screen triggers refresh
✅ Fresh data fetched (includes server-side delete)
✅ No duplicate transactions or sync issues
```

## Testing the Cascade Delete

### Test Case 1: Basic Deletion
1. Add a transaction (e.g., $50 groceries)
2. Go to Analytics tab
3. Note category percentage and total
4. Go back to Transactions
5. Long-press and delete the transaction
6. Confirm success alert
7. Go back to Analytics
8. Verify category and total updated

### Test Case 2: Multiple Screen Navigation
1. Add transaction in Transactions tab
2. Go to Analytics → observe transaction is included
3. Go to Breakdown → observe transaction is included
4. Go to Insights → observe metrics are affected
5. Go back to Transactions
6. Delete the transaction
7. Navigate to each screen (Analytics, Breakdown, Insights)
8. Verify deletion reflected everywhere

### Test Case 3: Error Recovery
1. Attempt to delete while offline
2. Observe error alert
3. See transaction still in list
4. Come back online
5. Retry delete
6. Verify deletion successful
7. Check Analytics/Breakdown are updated

## Performance Considerations

- **Efficient Re-fetching:** Only fetches transactions when screen gains focus (not on every re-render)
- **Cached State:** Use React hooks (useState) to avoid unnecessary API calls between navigations
- **Pull-to-Refresh:** Manual refresh available on all screens for immediate updates if needed
- **Async Operations:** All API calls non-blocking; UI remains responsive during deletion

## Security

- JWT token automatically injected via `getAuthHeaders()`
- Backend validates user has permission to delete transaction
- Only authorized user's transactions can be deleted
- Token stored securely in device keychain (Expo Secure Store)

## Related Files

- **Core Logic:** `src/screens/TransactionsListScreen.js` (delete handler)
- **API Layer:** `src/services/api.js` (deleteTransaction function)
- **Analytics Sync:** `src/screens/AnalyticsScreen.js` (useFocusEffect hook)
- **Breakdown Sync:** `src/screens/SpendingBreakdownScreen.js` (useFocusEffect hook)
- **Insights Sync:** `src/screens/AIInsightsScreen.js` (useFocusEffect hook)

## Future Enhancements

- [ ] Undo functionality (soft delete + restore)
- [ ] Batch delete multiple transactions
- [ ] Delete confirmation with preview
- [ ] Analytics change diff (show what changed)
- [ ] Delete history/audit log

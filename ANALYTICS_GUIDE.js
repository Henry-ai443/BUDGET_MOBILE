/**
 * ======================================================
 * ANALYTICS SCREENS - QUICK REFERENCE & FEATURE GUIDE
 * ======================================================
 *
 * Two comprehensive analytics screens have been added to provide
 * deep insights into user spending patterns and financial health.
 *
 * SCREEN 1: ANALYTICS DASHBOARD (AnalyticsScreen.js)
 * =====================================================
 * Purpose: High-level overview of spending with interactive charts
 * 
 * Features:
 * ---------
 *
 * 1. SUMMARY CARDS (Top of screen)
 *    - Total Income: Sum of all income transactions
 *    - Total Expense: Sum of all expense transactions
 *    - Balance: Income - Expense (color indicates positive/negative)
 *    - All formatted as currency with large, readable fonts
 *
 * 2. MONTHLY SPENDING TREND (Line Chart)
 *    - X-axis: Last 6 months
 *    - Y-axis: Amount spent
 *    - Green line showing spending trajectory
 *    - Helps identify spending trends over time
 *    - Shows if spending is increasing or decreasing
 *
 * 3. SPENDING BY CATEGORY (Pie Chart)
 *    - 6 most important expense categories
 *    - Color-coded segments (different color per category)
 *    - Shows percentage and amount per category
 *    - Helps identify where most money goes
 *
 * 4. EXPENSE VS INCOME (Bar Chart)
 *    - Two bars: Expense and Income
 *    - Visual comparison of money in vs money out
 *    - Shows if user is saving or overspending
 *
 * 5. TOP CATEGORIES LIST
 *    - Ranked by amount spent
 *    - Shows category, amount, and percentage
 *    - Limited to top 3 for brevity
 *
 * Data Calculation:
 *    - Fetches last 100 transactions
 *    - Calculates all metrics in real-time
 *    - Groups by category and month
 *    - Handles empty data gracefully
 *
 * User Interactions:
 *    - Pull-to-refresh to reload data
 *    - Automatic calculation on mount
 *    - Touch-friendly layout
 *    - Loading indicator while fetching
 *
 * Technical Details:
 *    - Uses react-native-chart-kit for rendering
 *    - Responsive charts that adapt to screen width
 *    - Memory-efficient data processing
 *    - Error boundary for failed data loads
 *
 * ====================================================
 * SCREEN 2: SPENDING BREAKDOWN (SpendingBreakdownScreen.js)
 * ====================================================
 * Purpose: Detailed, granular analysis of spending patterns
 *
 * Features:
 * ---------
 *
 * 1. METRIC CARDS (Top section)
 *    - Average Daily Spending: Total expense / number of days
 *    - Highest Day: Day with most spending + amount
 *    - Transaction Count: Total number of transactions recorded
 *    - Helps understand daily spending behavior
 *
 * 2. FILTER TOGGLE (Two-button selector)
 *    - By Category: Default view
 *    - By Day: Alternative view
 *    - Toggle between views without page reload
 *
 * 3. BY CATEGORY VIEW
 *    ├── Bar Chart (Top 5 Categories)
 *    │   - Horizontal comparison of top spenders
 *    │   - Clear visual hierarchy
 *    │   - Shows exact amounts on chart
 *    │
 *    └── Detailed Category List
 *        For each category:
 *        ├── Category name (clickable future enhancement)
 *        ├── Spending amount
 *        ├── Percentage of total
 *        ├── Progress bar showing % visually
 *        │   └── Color-coded: Green (low) → Amber (medium) → Red (high)
 *        └── Percentage text in matching color
 *
 * 4. BY DAY VIEW
 *    - Top 7 spending days ranked
 *    - For each day:
 *        ├── Rank number (1st, 2nd, etc)
 *        ├── Date in readable format (e.g., "Feb 20")
 *        ├── Total spent that day
 *        └── Helps identify spending patterns
 *
 * 5. INSIGHTS & CONTEXT
 *    - Progress bars provide visual understanding
 *    - Color coding (green/amber/red) for quick interpretation
 *    - Metric cards give quick statistics
 *    - Helps identify overspending categories
 *
 * Data Calculation:
 *    - Fetches last 150 transactions
 *    - Groups by category and date
 *    - Calculates percentages and averages
 *    - Handles edge cases (no data, incomplete data)
 *
 * User Interactions:
 *    - Toggle between views
 *    - Pull-to-refresh for updated data
 *    - Scroll to see more categories/days
 *    - Long-press category (future feature)
 *
 * =================================================
 * ADVANCED FEATURES IN BOTH SCREENS
 * =================================================
 *
 * 1. RESPONSIVE DESIGN
 *    - Charts scale to device width
 *    - Touch-friendly spacing
 *    - Readable on all screen sizes
 *    - Safe area handling for notches
 *
 * 2. DATA VALIDATION
 *    - Handles empty/null data
 *    - Shows empty states with helpful messages
 *    - Prevents crashes from bad data
 *    - Graceful error handling
 *
 * 3. PERFORMANCE OPTIMIZATION
 *    - Loads only 100-150 transactions
 *    - Calculations run once, then cached
 *    - Charts memoized to prevent re-renders
 *    - Efficient FlatList rendering
 *
 * 4. COLOR PSYCHOLOGY
 *    Green (#28a745): Positive, savings, good budget allocation
 *    Red (#dc3545): Caution, overspending, high expenses
 *    Amber (#ffc107): Moderate, medium spending
 *    Gray: Neutral, less important info
 *
 * 5. ACCESSIBILITY
 *    - Large, readable fonts
 *    - High contrast colors
 *    - Clear labels and descriptions
 *    - Proper spacing for touch targets
 *
 * =================================================
 * API INTEGRATION
 * =================================================
 *
 * Data Source:
 *    GET /api/transactions?page=1&limit=100 (Analytics)
 *    GET /api/transactions?page=1&limit=150 (Breakdown)
 *
 * Response Format:
 *    {
 *      transactions: [
 *        {
 *          _id: string,
 *          type: 'income' | 'expense',
 *          amount: number,
 *          category: string,
 *          date: ISO string,
 *          note: string
 *        },
 *        ...
 *      ],
 *      total: number
 *    }
 *
 * Error Handling:
 *    - Network failures show error message with retry button
 *    - Malformed data is skipped gracefully
 *    - Empty results show helpful empty state
 *
 * =================================================
 * CHART LIBRARY DETAILS (react-native-chart-kit)
 * =================================================
 *
 * LineChart:
 *    Used for: Monthly spending trends
 *    Supports: Multiple data series, bezier curves, dots
 *    Customization: Colors, opacity, stroke width
 *
 * PieChart:
 *    Used for: Category breakdown visualization
 *    Supports: Multiple segments, legend, custom colors
 *    Customization: Accessor path, padding
 *
 * BarChart:
 *    Used for: Expense vs Income, Category comparison
 *    Supports: Multiple datasets, grouped bars
 *    Customization: Colors, bar percentage, labels
 *
 * =================================================
 * STATE MANAGEMENT
 * =================================================
 *
 * AnalyticsScreen State:
 *    - transactions: Raw transaction data
 *    - loading: Boolean for initial load
 *    - refreshing: Boolean for pull-to-refresh
 *    - error: Error message if any
 *    - chartData: Calculated chart data
 *    - selectedPeriod: Not used currently (can be implemented)
 *
 * SpendingBreakdownScreen State:
 *    - transactions: Raw transaction data
 *    - loading: Boolean for initial load
 *    - refreshing: Boolean for pull-to-refresh
 *    - error: Error message if any
 *    - breakdownData: Calculated breakdown data
 *    - selectedFilter: 'category' or 'daily'
 *
 * Data Flow:
 *    API call → Raw transactions → Calculate metrics → Store in state
 *                                    ↓
 *                              Re-render with new data
 *
 * =================================================
 * STYLING APPROACH
 * =================================================
 *
 * Centralized Theme Usage:
 *    - Colors from theme.js
 *    - Spacing constants
 *    - Font sizes
 *    - Border radius values
 *    - Consistent across app
 *
 * StyleSheet.create():
 *    - Compiled to native styles (performance)
 *    - Separated from logic
 *    - Reusable across components
 *
 * Responsive Styles:
 *    - Use Dimensions API for chart width
 *    - Flex layout for responsive UI
 *    - Safe area handling
 *
 * =================================================
 * FUTURE ENHANCEMENTS
 * =================================================
 *
 * Potential additions:
 * 1. Time range picker (custom date ranges)
 * 2. Category filtering (view specific category)
 * 3. Export to CSV/PDF
 * 4. Comparison with previous period
 * 5. Spending goals and alerts
 * 6. Predictive spending forecasts
 * 7. Share insights on social media
 * 8. Integration with bank APIs
 * 9. Receipt scanning with OCR
 * 10. Multi-currency support
 *
 * =================================================
 * TROUBLESHOOTING
 * =================================================
 *
 * Charts not rendering:
 *    - Check if transactions are loading
 *    - Verify Dimensions.get() working
 *    - Check screenWidth calculation
 *
 * Calculations incorrect:
 *    - Verify transaction data format
 *    - Check date parsing
 *    - Test with known data
 *
 * Performance issues:
 *    - Reduce transaction fetch limit
 *    - Check for unnecessary re-renders
 *    - Use React DevTools Profiler
 *
 * =================================================
 */

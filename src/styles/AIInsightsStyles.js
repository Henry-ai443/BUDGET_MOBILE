import { StyleSheet } from 'react-native';
import theme from '../theme/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray600,
    marginTop: theme.spacing.md,
  },

  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },

  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black,
  },

  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },

  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    alignItems: 'center',
  },

  periodButtonActive: {
    borderColor: theme.colors.green,
    backgroundColor: theme.colors.green,
  },

  periodButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray600,
  },

  periodButtonTextActive: {
    color: theme.colors.white,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    elevation: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
  },

  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },

  summaryItem: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.sm / 2,
  },

  summaryAmount: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.green,
  },

  categoriesSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
  },

  sectionSubtitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
  },

  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },

  categoryName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    textTransform: 'capitalize',
  },

  categoryAmount: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black,
  },

  insightItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },

  insightIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
    marginTop: 2,
  },

  insightText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    lineHeight: 20,
  },

  actionItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },

  actionBullet: {
    fontSize: theme.fontSize.md,
    color: theme.colors.green,
    marginRight: theme.spacing.md,
    marginTop: -2,
  },

  actionText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    lineHeight: 20,
  },

  rawInsightText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    lineHeight: 22,
  },

  infoContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },

  infoText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray600,
    lineHeight: 18,
    textAlign: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },

  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },

  emptyButton: {
    backgroundColor: theme.colors.green,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },

  emptyButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },

  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.red,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: theme.colors.green,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },

  retryText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
  },
});

import { StyleSheet } from 'react-native';
import theme from '../theme/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },

  backButton: {
    fontSize: theme.fontSize.md,
    color: theme.colors.green,
    fontWeight: theme.fontWeight.medium,
  },

  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black,
  },

  typeToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  typeToggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  typeToggleButtonActive: {
    borderColor: theme.colors.green,
    backgroundColor: theme.colors.green,
  },

  typeToggleText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray600,
  },

  typeToggleTextActive: {
    color: theme.colors.white,
  },

  formGroup: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },

  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    paddingHorizontal: theme.spacing.md,
    height: 50,
  },

  inputError: {
    borderColor: theme.colors.red,
  },

  currencySymbol: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.green,
    marginRight: theme.spacing.sm,
  },

  amountInput: {
    flex: 1,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black,
    paddingVertical: 0,
  },

  pickerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    overflow: 'hidden',
    height: 50,
  },

  picker: {
    flex: 1,
    color: theme.colors.black,
  },

  noteInput: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.black,
    textAlignVertical: 'top',
    minHeight: 80,
  },

  charCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray400,
    marginTop: theme.spacing.sm / 2,
    textAlign: 'right',
  },

  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.red,
    marginTop: theme.spacing.sm / 2,
  },

  submitButton: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.green,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  helpContainer: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.green,
  },

  helpText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    lineHeight: 20,
  },
});

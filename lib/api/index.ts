// API Client
export { default as apiClient, setAccessToken, getAccessToken, setRefreshToken, getRefreshToken, clearTokens, isApiError } from './client';
export type { ApiError } from './client';

// Auth API
export { default as authApi } from './auth';
export type { LoginDto, RegisterDto, ChangePasswordDto, AuthResponse, LoginResponse } from './auth';

// User API
export { default as userApi } from './user';
export type { UpdateProfileDto, UpdatePreferencesDto, UserProfileResponse, PreferencesResponse } from './user';

// Accounts API
export { default as accountsApi } from './accounts';
export type { CreateAccountDto, UpdateAccountDto, AccountResponse } from './accounts';

// Transactions API
export { default as transactionsApi } from './transactions';
export type { CreateTransactionDto, UpdateTransactionDto, QueryTransactionParams, TransactionResponse, PaginatedResponse } from './transactions';

// Assets API
export { default as assetsApi } from './assets';
export type { CreateAssetDto, UpdateAssetDto, CreateAssetHistoryDto, AssetResponse, AssetsListResponse } from './assets';

// Budgets API
export { default as budgetsApi } from './budgets';
export type { CreateBudgetDto, UpdateBudgetDto, QueryBudgetParams, BudgetResponse } from './budgets';

// Dashboard API
export { default as dashboardApi } from './dashboard';
export type { DashboardSummary, DashboardSummaryResponse, CashflowResponse, ExpenseCategoryResponse } from './dashboard';

// Reports API
export { default as reportsApi } from './reports';
export type { MonthlyReportResponse, YearlyReportResponse } from './reports';

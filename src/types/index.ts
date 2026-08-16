export type PaymentMethod = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';

export type UserRole = 'ADMIN' | 'COMMITTEE_MEMBER' | 'TREASURER' | 'VIEWER';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Devotee {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  isAnonymous: boolean;
  totalContributed: number;
  lastOfferingDate?: string;
}

export interface Donation {
  id: string;
  devoteeId?: string;
  devoteeName: string;
  mobile: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  upiRef?: string;
  purpose: string;
  notes?: string;
  receiptNumber: string;
  status: PaymentStatus;
  createdAt?: string;
}

export type ExpenseCategoryType =
  | 'GANESH_IDOL'
  | 'DECORATION'
  | 'FLOWERS'
  | 'LIGHTING'
  | 'SOUND_SYSTEM'
  | 'POOJA_ITEMS'
  | 'PRASADAM_FOOD'
  | 'CULTURAL'
  | 'TRANSPORT'
  | 'TENT_MANDAP'
  | 'CLEANING'
  | 'ADVERTISEMENT'
  | 'MISCELLANEOUS';

export interface ExpenseCategory {
  id: string;
  name: string;
  type: ExpenseCategoryType;
  icon: string;
  color: string;
  budgetAllocated: number;
}

export interface Expense {
  id: string;
  categoryId?: string;
  categoryName: string;
  title: string;
  amount: number;
  paidAmount: number;
  vendorId?: string;
  vendorName?: string;
  date?: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  notes?: string;
  isPaid: boolean;
  recordedBy?: string;
}

export interface Payment {
  id: string;
  description: string;
  serviceCategory: string;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  dueDate?: string;
  transactionReference?: string;
  vendorName?: string;
  notes?: string;
  processedBy?: string;
  createdAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  serviceCategory: string;
  mobile: string;
  totalAgreedAmount: number;
  totalPaidAmount: number;
  pendingBalance: number;
  dueDate: string;
  status: PaymentStatus;
}

export interface BudgetSankalp {
  id: string;
  categoryName: string;
  targetBudget: number;
  actualSpent: number;
  committed: number;
}

export interface FinancialSummary {
  totalOfferingsReceived: number;
  totalSevaExpensesPaid: number;
  currentBalance: number;
  totalPendingPayments: number;
  availableBalance: number;
  totalDevoteesCount: number;
  totalTargetBudget: number;
  todayOfferings: number;
  todayExpenses: number;
  todayNetBalance: number;
  todayDevoteesCount: number;
  todayTransactionsCount: number;
  eventPreparationProgress: number;
}

export interface DevotionalMessage {
  id: string;
  telugu: string;
  meaning: string;
  source: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
}

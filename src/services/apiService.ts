import {
  FinancialSummary,
  Donation,
  Expense,
  Payment,
  Vendor,
  BudgetSankalp,
  PaymentMethod,
  PaymentStatus
} from '../types';
import { apiFetch } from '../api/apiClient';

class RealApiService {
  public async getSummary(): Promise<FinancialSummary> {
    try {
      return await apiFetch<FinancialSummary>('/dashboard/summary');
    } catch {
      return {
        totalOfferingsReceived: 0,
        totalSevaExpensesPaid: 0,
        currentBalance: 0,
        totalPendingPayments: 0,
        availableBalance: 0,
        totalDevoteesCount: 0,
        totalTargetBudget: 200000,
        todayOfferings: 0,
        todayExpenses: 0,
        todayNetBalance: 0,
        todayDevoteesCount: 0,
        todayTransactionsCount: 0,
        eventPreparationProgress: 0,
      };
    }
  }

  public async getDonations(): Promise<Donation[]> {
    try {
      return await apiFetch<Donation[]>('/donations');
    } catch {
      return [];
    }
  }

  public async addDonation(input: {
    devoteeName: string;
    mobile: string;
    amount: number;
    paymentMethod: PaymentMethod;
    upiRef?: string;
    purpose: string;
    notes?: string;
    status?: PaymentStatus;
  }): Promise<Donation> {
    return await apiFetch<Donation>('/donations', {
      method: 'POST',
      body: JSON.stringify({
        devoteeName: input.devoteeName,
        mobile: input.mobile,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        upiRef: input.upiRef,
        purpose: input.purpose,
        notes: input.notes,
        status: input.status || 'COMPLETED',
      }),
    });
  }

  public async updateDonationStatus(id: string | number, newStatus: PaymentStatus): Promise<Donation> {
    return await apiFetch<Donation>(`/donations/${id}/status?newStatus=${newStatus}`, {
      method: 'PUT',
    });
  }

  public async getExpenses(): Promise<Expense[]> {
    try {
      return await apiFetch<Expense[]>('/expenses');
    } catch {
      return [];
    }
  }

  public async addExpense(input: {
    categoryName: string;
    title: string;
    amount: number;
    vendorName?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    receiptUrl?: string;
    recordedBy?: string;
  }): Promise<Expense> {
    return await apiFetch<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        amount: input.amount,
        paidAmount: input.amount,
        paymentMethod: input.paymentMethod,
        receiptUrl: input.receiptUrl,
        notes: input.notes,
        recordedBy: input.recordedBy || 'System Administrator',
        category: { id: 1, name: input.categoryName, code: input.categoryName.toUpperCase() },
      }),
    });
  }

  public async getPayments(): Promise<Payment[]> {
    try {
      return await apiFetch<Payment[]>('/payments');
    } catch {
      return [];
    }
  }

  public async updatePaymentStatus(id: string | number, newStatus: PaymentStatus, userName?: string): Promise<Payment> {
    const url = userName
      ? `/payments/${id}/status?newStatus=${newStatus}&userName=${encodeURIComponent(userName)}`
      : `/payments/${id}/status?newStatus=${newStatus}`;
    return await apiFetch<Payment>(url, {
      method: 'PUT',
    });
  }

  public async getVendors(): Promise<Vendor[]> {
    try {
      return await apiFetch<Vendor[]>('/vendors');
    } catch {
      return [];
    }
  }

  public async addVendor(input: {
    name: string;
    serviceCategory: string;
    mobile: string;
    totalAgreedAmount: number;
    dueDate?: string;
  }): Promise<Vendor> {
    return await apiFetch<Vendor>('/vendors', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  public async getBudgets(): Promise<BudgetSankalp[]> {
    try {
      return await apiFetch<BudgetSankalp[]>('/budgets');
    } catch {
      return [];
    }
  }

  public async updateBudget(id: string | number, targetBudget: number, categoryName?: string): Promise<BudgetSankalp> {
    return await apiFetch<BudgetSankalp>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ targetBudget, categoryName }),
    });
  }

  public async addBudget(input: { categoryName: string; targetBudget: number }): Promise<BudgetSankalp> {
    return await apiFetch<BudgetSankalp>('/budgets', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  public async resetDevDatabase(): Promise<void> {
    await apiFetch('/dev/reset-database', { method: 'POST' });
  }
}

export const apiService = new RealApiService();

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavTab, MandapamFrame } from './components/devotional/MandapamFrame';
import { MandapamHeader } from './components/devotional/MandapamHeader';
import { FloatingPetals } from './components/devotional/FloatingPetals';

// Pages
import { LandingPage } from './pages/LandingPage';
import { MandapamDashboard } from './pages/MandapamDashboard';
import { OfferingsPage } from './pages/OfferingsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { BudgetPage } from './pages/BudgetPage';
import { VendorsPage } from './pages/VendorsPage';
import { ReportsPage } from './pages/ReportsPage';
import { GalleryPage } from './pages/GalleryPage';
import { LoginPage } from './pages/LoginPage';
import { SettingsPage } from './pages/SettingsPage';
import { CommitteePage } from './pages/CommitteePage';
import { AppearancePage } from './pages/AppearancePage';
import { AuditLogsPage } from './pages/AuditLogsPage';

// Services & Models
import { apiService } from './services/apiService';
import { FinancialSummary, Donation, Expense, Payment, BudgetSankalp } from './types';

const ZERO_SUMMARY: FinancialSummary = {
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

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [viewState, setViewState] = useState<'LANDING' | 'APP' | 'LOGIN'>('LANDING');
  const [activeTab, setActiveTab] = useState<NavTab>('mandapam');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authoritative State fetched directly from Spring Boot H2 Database
  const [summary, setSummary] = useState<FinancialSummary>(ZERO_SUMMARY);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [budgets, setBudgets] = useState<BudgetSankalp[]>([]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const s = await apiService.getSummary();
      const d = await apiService.getDonations();
      const e = await apiService.getExpenses();
      const p = await apiService.getPayments();
      const b = await apiService.getBudgets();

      setSummary(s);
      setDonations(d);
      setExpenses(e);
      setPayments(p);
      setBudgets(b);
    } catch {
      // API error handler
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (viewState === 'LANDING') {
    return (
      <LandingPage
        onEnterMandapam={() => setViewState('APP')}
        onViewFinances={() => {
          setActiveTab('reports');
          setViewState('APP');
        }}
      />
    );
  }

  if (viewState === 'LOGIN' || (!isAuthenticated && viewState === 'APP')) {
    return <LoginPage onLoginSuccess={() => setViewState('APP')} />;
  }

  return (
    <div className="relative min-h-screen">
      <FloatingPetals />

      <MandapamHeader
        onOpenOfferingModal={() => setActiveTab('offerings')}
        onOpenExpenseModal={() => setActiveTab('expenses')}
        onNavigateToReports={() => setActiveTab('reports')}
      />

      <MandapamFrame activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'mandapam' && (
          <MandapamDashboard
            summary={summary}
            expenses={expenses}
            isLoading={isLoading}
            onOpenOfferingModal={() => setActiveTab('offerings')}
            onOpenExpenseModal={() => setActiveTab('expenses')}
          />
        )}

        {activeTab === 'offerings' && (
          <OfferingsPage donations={donations} onRefreshData={refreshData} />
        )}

        {activeTab === 'expenses' && (
          <ExpensesPage expenses={expenses} onRefreshData={refreshData} />
        )}

        {activeTab === 'budget' && (
          <BudgetPage budgets={budgets} summary={summary} onRefreshData={refreshData} />
        )}

        {activeTab === 'payments' && (
          <VendorsPage vendors={payments} onRefreshData={refreshData} />
        )}

        {activeTab === 'reports' && (
          <ReportsPage summary={summary} donations={donations} expenses={expenses} />
        )}

        {activeTab === 'gallery' && <GalleryPage />}

        {activeTab === 'committee' && <CommitteePage />}

        {activeTab === 'appearance' && <AppearancePage />}

        {activeTab === 'audit-logs' && <AuditLogsPage />}

        {activeTab === 'settings' && <SettingsPage />}
      </MandapamFrame>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

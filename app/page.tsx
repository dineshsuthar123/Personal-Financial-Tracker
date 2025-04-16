'use client';

import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExpensesChart from './components/ExpensesChart';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import ErrorBoundary from './components/ErrorBoundary';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  type: 'expense' | 'income';
  date: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: Transaction[] = await response.json();
      setTransactions(data);
    } catch (error: unknown) {
      console.error('Error fetching transactions:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(`Failed to fetch transactions: ${error.message}`);
        }
      } else {
        setError('An unknown error occurred while fetching transactions.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Transaction, '_id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const url = editingTransaction
        ? `/api/transactions/${editingTransaction._id}`
        : '/api/transactions';
      const method = editingTransaction ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      await fetchTransactions();
      setIsDialogOpen(false);
      setEditingTransaction(null);
    } catch (error: unknown) {
      console.error('Error submitting transaction:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(`Failed to submit transaction: ${error.message}`);
        }
      } else {
        setError('An unknown error occurred while submitting the transaction.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      await fetchTransactions();
    } catch (error: unknown) {
      console.error('Failed to delete transaction:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(`Failed to delete transaction: ${error.message}`);
        }
      } else {
        setError('An unknown error occurred while deleting the transaction.');
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType !== 'all' && transaction.type !== filterType) {
      return false;
    }

    if (dateRange === 'all') {
      return true;
    }

    const transactionDate = new Date(transaction.date);
    const now = new Date();

    if (dateRange === 'month') {
      const monthAgo = subMonths(now, 1);
      return transactionDate >= monthAgo;
    }

    if (dateRange === 'quarter') {
      const quarterAgo = subMonths(now, 3);
      return transactionDate >= quarterAgo;
    }

    if (dateRange === 'year') {
      const yearAgo = subMonths(now, 12);
      return transactionDate >= yearAgo;
    }

    return true;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto p-4 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Personal Finance Tracker
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and visualize your financial data
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="sm:max-w-md"
                aria-describedby="dialog-description"
              >
                <DialogHeader>
                  <DialogTitle>
                    {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                  </DialogTitle>
                  <DialogDescription id="dialog-description">
                    {editingTransaction ? 'Edit your transaction details below.' : 'Fill in the transaction details below.'}
                  </DialogDescription>
                </DialogHeader>
                <TransactionForm
                  onSubmit={handleSubmit}
                  initialData={editingTransaction || undefined}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {balance >= 0 ? 'Positive balance' : 'Negative balance'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  All time income
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingDown className="inline h-3 w-3 mr-1" />
                  All time expenses
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle>Monthly Expenses</CardTitle>
                  <CardDescription>
                    Track your spending patterns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpensesChart transactions={transactions} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transactions" className="space-y-4">
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle>Transaction History</CardTitle>
                      <CardDescription>
                        View and manage your financial transactions
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select 
                          className="text-sm border rounded-md px-2 py-1 bg-transparent"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as 'all' | 'expense' | 'income')}
                        >
                          <option value="all">All Types</option>
                          <option value="expense">Expenses</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <select 
                          className="text-sm border rounded-md px-2 py-1 bg-transparent"
                          value={dateRange}
                          onChange={(e) => setDateRange(e.target.value as 'all' | 'month' | 'quarter' | 'year')}
                        >
                          <option value="all">All Time</option>
                          <option value="month">Last Month</option>
                          <option value="quarter">Last Quarter</option>
                          <option value="year">Last Year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <TransactionList
                    transactions={filteredTransactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ErrorBoundary>
  );
} 
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

interface Transaction {
  amount: number;
  type: 'expense' | 'income';
  date: string;
}

interface ExpensesChartProps {
  transactions: Transaction[];
}

export default function ExpensesChart({ transactions }: ExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const months = eachMonthOfInterval({
      start: sixMonthsAgo,
      end: now,
    });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthlyExpenses = transactions
        .filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transaction.type === 'expense' &&
            transactionDate >= monthStart &&
            transactionDate <= monthEnd
          );
        })
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        expenses: monthlyExpenses,
      };
    });
  }, [transactions]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Expenses']}
          />
          <Bar dataKey="expenses" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/context/FinanceContext';
import { SummaryCard } from '@/components/SummaryCard';
import { RecordCard } from '@/components/RecordCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, PlusCircle } from 'lucide-react';
import { loadUser } from '@/lib/storage';

const COLORS = {
  Income: '#16a34a',
  Expense: '#ef4444',
  'Net Profit': '#0f6fff'
};

const DEFAULT_INCOME = 50000;
const DEFAULT_EXPENSE = 9000;
const DEFAULT_NET_PROFIT = DEFAULT_INCOME - DEFAULT_EXPENSE;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="font-semibold text-sm"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const { records, loading } = useFinance();

  useEffect(() => {
    const user = loadUser();
    if (!user) navigate('/login');
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const incomeFromRecords = records
    .filter(r => r.type === 'Income')
    .reduce((sum, r) => sum + r.amount, 0);

  const expenseFromRecords = records
    .filter(r => r.type === 'Expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalIncome = incomeFromRecords || DEFAULT_INCOME;
  const totalExpense = expenseFromRecords || DEFAULT_EXPENSE;
  const netProfit =
    incomeFromRecords || expenseFromRecords
      ? incomeFromRecords - expenseFromRecords
      : DEFAULT_NET_PROFIT;

  const chartData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense },
    { name: 'Net Profit', value: Math.max(netProfit, 0) }
  ].filter(item => item.value > 0);

  const user = loadUser();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/40">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl ring-1 ring-black/5 p-6 md:p-8">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome back, {'Guest'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Your income, expenses & profit overview
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <SummaryCard title="Income" value={totalIncome} icon={TrendingUp} color={COLORS.Income} />
            <SummaryCard title="Expense" value={totalExpense} icon={TrendingDown} color={COLORS.Expense} />
            <SummaryCard title="Net Profit" value={netProfit} icon={IndianRupee} color={COLORS['Net Profit']} />
          </div>

          <Card className="mb-10 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Income vs Expense vs Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius="70%"
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl md:text-2xl font-semibold">All Records</h2>
              
            </div>

            {records.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-16">
                  <IndianRupee className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No records yet</h3>
                  <p className="text-muted-foreground mb-6 text-center">
                    Default values are shown until you add your first record
                  </p>
                  <Button onClick={() => navigate('/add')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create First Record
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {records.map(record => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onClick={() => navigate(`/edit/${record.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

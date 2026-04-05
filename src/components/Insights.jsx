import { TrendingUp, AlertCircle, Target, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Insights = () => {
  const { transactions, darkMode } = useApp()

  const currentMonth = new Date().getMonth()
  const lastMonth = currentMonth - 1

  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      return acc
    }, {})

  const highestCategory = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)[0]

  const currentMonthTotal = Math.abs(transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0))

  const lastMonthTotal = Math.abs(transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === lastMonth)
    .reduce((sum, t) => sum + t.amount, 0))

  const monthlyChange = lastMonthTotal > 0 
    ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
    : 0

  const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate()
  const avgDailySpending = currentMonthTotal / daysInMonth

  const currentMonthIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0)

  const savingsRate = currentMonthIncome > 0 
    ? ((currentMonthIncome - currentMonthTotal) / currentMonthIncome * 100).toFixed(1)
    : 0

  const insights = [
    {
      icon: TrendingUp,
      title: 'Highest Spending Category',
      value: highestCategory ? highestCategory[0] : 'N/A',
      detail: highestCategory ? `$${highestCategory[1].toFixed(2)} spent` : '',
      iconBg: darkMode ? 'bg-red-500/10' : 'bg-red-100',
      iconColor: darkMode ? 'text-red-400' : 'text-red-600'
    },
    {
      icon: Calendar,
      title: 'Monthly Comparison',
      value: `${monthlyChange > 0 ? '+' : ''}${monthlyChange}%`,
      detail: monthlyChange > 0 ? 'Spending increased' : 'Spending decreased',
      iconBg: monthlyChange > 0 ? (darkMode ? 'bg-red-500/10' : 'bg-red-100') : (darkMode ? 'bg-green-500/10' : 'bg-green-100'),
      iconColor: monthlyChange > 0 ? (darkMode ? 'text-red-400' : 'text-red-600') : (darkMode ? 'text-green-400' : 'text-green-600')
    },
    {
      icon: Target,
      title: 'Average Daily Spending',
      value: `$${avgDailySpending.toFixed(2)}`,
      detail: 'This month',
      iconBg: darkMode ? 'bg-blue-500/10' : 'bg-blue-100',
      iconColor: darkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      icon: AlertCircle,
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      detail: savingsRate > 20 ? 'Great job!' : 'Consider saving more',
      iconBg: savingsRate > 20 ? (darkMode ? 'bg-green-500/10' : 'bg-green-100') : (darkMode ? 'bg-orange-500/10' : 'bg-orange-100'),
      iconColor: savingsRate > 20 ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-orange-400' : 'text-orange-600')
    }
  ]

  return (
    <div className={`rounded-xl border p-6 backdrop-blur ${
      darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'
    }`}>
      <h2 className={`mb-6 text-xl font-semibold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
        Insights
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`group relative overflow-hidden rounded-lg border p-4 transition-all ${
              darkMode 
                ? 'border-slate-800 bg-slate-800/30 hover:border-slate-700' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="relative flex gap-3">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${insight.iconBg}`}>
                <insight.icon className={`h-5 w-5 ${insight.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {insight.title}
                </p>
                <p className={`mt-1 truncate text-xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
                  {insight.value}
                </p>
                <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {insight.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Insights

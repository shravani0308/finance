import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react'
import { useApp } from '../context/AppContext'

const SummaryCards = () => {
  const { transactions, darkMode } = useApp()

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = Math.abs(transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0))

  const balance = totalIncome - totalExpenses

  const currentMonth = new Date().getMonth()
  const lastMonth = currentMonth - 1

  const currentMonthExpenses = Math.abs(transactions
    .filter(t => {
      const tMonth = new Date(t.date).getMonth()
      return t.type === 'expense' && tMonth === currentMonth
    })
    .reduce((sum, t) => sum + t.amount, 0))

  const lastMonthExpenses = Math.abs(transactions
    .filter(t => {
      const tMonth = new Date(t.date).getMonth()
      return t.type === 'expense' && tMonth === lastMonth
    })
    .reduce((sum, t) => sum + t.amount, 0))

  const expenseChange = lastMonthExpenses > 0 
    ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1)
    : 0

  const cards = [
    {
      title: 'Total Balance',
      value: balance,
      icon: Wallet,
      iconBg: darkMode ? 'bg-blue-500/10' : 'bg-blue-100',
      iconColor: darkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      iconBg: darkMode ? 'bg-green-500/10' : 'bg-green-100',
      iconColor: darkMode ? 'text-green-400' : 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      iconBg: darkMode ? 'bg-red-500/10' : 'bg-red-100',
      iconColor: darkMode ? 'text-red-400' : 'text-red-600',
      change: expenseChange
    },
    {
      title: 'This Month',
      value: currentMonthExpenses,
      icon: DollarSign,
      iconBg: darkMode ? 'bg-purple-500/10' : 'bg-purple-100',
      iconColor: darkMode ? 'text-purple-400' : 'text-purple-600'
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`group relative overflow-hidden rounded-xl border p-6 backdrop-blur transition-all hover:shadow-lg ${
            darkMode 
              ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:shadow-slate-900/50' 
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-gray-200'
          }`}
        >
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {card.title}
                </p>
                <h3 className={`mt-2 text-3xl font-bold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
                  ${Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                {card.change && (
                  <p className={`mt-2 text-sm font-medium ${
                    parseFloat(card.change) > 0 
                      ? darkMode ? 'text-red-400' : 'text-red-600'
                      : darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {parseFloat(card.change) > 0 ? '+' : ''}{card.change}% from last month
                  </p>
                )}
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.iconBg}`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards

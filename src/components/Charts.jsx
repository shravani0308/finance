import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'

const Charts = () => {
  const { transactions, darkMode } = useApp()

  const balanceTrend = transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, transaction) => {
      const date = transaction.date
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0
      const newBalance = lastBalance + transaction.amount
      
      const existingDate = acc.find(item => item.date === date)
      if (existingDate) {
        existingDate.balance = newBalance
      } else {
        acc.push({ date, balance: newBalance })
      }
      return acc
    }, [])

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.category === t.category)
      if (existing) {
        existing.amount += Math.abs(t.amount)
      } else {
        acc.push({ category: t.category, amount: Math.abs(t.amount) })
      }
      return acc
    }, [])
    .sort((a, b) => b.amount - a.amount)

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`rounded-lg border p-3 shadow-xl backdrop-blur ${
          darkMode 
            ? 'border-slate-700 bg-slate-800/95' 
            : 'border-gray-300 bg-white/95'
        }`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {label}
          </p>
          <p className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )
    }
    return null
  }

  const chartColors = {
    text: darkMode ? '#94a3b8' : '#64748b',
    grid: darkMode ? '#334155' : '#e2e8f0',
    line: '#3b82f6'
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={`rounded-xl border p-6 backdrop-blur ${
        darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'
      }`}>
        <h3 className={`mb-6 text-lg font-semibold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
          Balance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={balanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis 
              dataKey="date" 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text, fontSize: 12 }}
            />
            <YAxis 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text, fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke={chartColors.line} 
              strokeWidth={3}
              dot={{ fill: chartColors.line, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-xl border p-6 backdrop-blur ${
        darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'
      }`}>
        <h3 className={`mb-6 text-lg font-semibold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
          Spending by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis 
              dataKey="category" 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text, fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text, fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-xl border p-6 backdrop-blur lg:col-span-2 ${
        darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'
      }`}>
        <h3 className={`mb-6 text-lg font-semibold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
          Expense Distribution
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="amount"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Charts

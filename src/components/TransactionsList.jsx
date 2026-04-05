import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import EditTransactionModal from './EditTransactionModal'

const TransactionsList = ({ onAddClick }) => {
  const { transactions, userRole, deleteTransaction, darkMode } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [editingTransaction, setEditingTransaction] = useState(null)

  const categories = [...new Set(transactions.map(t => t.category))]

  let filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  filteredTransactions.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date)
      case 'date-asc':
        return new Date(a.date) - new Date(b.date)
      case 'amount-desc':
        return Math.abs(b.amount) - Math.abs(a.amount)
      case 'amount-asc':
        return Math.abs(a.amount) - Math.abs(b.amount)
      default:
        return 0
    }
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id)
    }
  }

  return (
    <div className={`rounded-xl border p-6 backdrop-blur ${
      darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'
    }`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
          Transactions
        </h2>
        {userRole === 'admin' && (
          <button 
            onClick={onAddClick}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        )}
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
            darkMode ? 'text-slate-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
              darkMode 
                ? 'border-slate-700 bg-slate-800/50 text-slate-200 placeholder-slate-400' 
                : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className={`rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
              darkMode 
                ? 'border-slate-700 bg-slate-800/50 text-slate-200' 
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
              darkMode 
                ? 'border-slate-700 bg-slate-800/50 text-slate-200' 
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={`rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
              darkMode 
                ? 'border-slate-700 bg-slate-800/50 text-slate-200' 
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="py-12 text-center">
          <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
          {filteredTransactions.map(transaction => (
            <div 
              key={transaction.id} 
              className={`group flex items-center gap-4 rounded-lg border p-4 transition-all ${
                darkMode 
                  ? 'border-slate-800 bg-slate-800/30 hover:border-slate-700 hover:bg-slate-800/50' 
                  : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                transaction.type === 'income' 
                  ? darkMode ? 'bg-green-500/10' : 'bg-green-50 border border-green-200'
                  : darkMode ? 'bg-red-500/10' : 'bg-red-50 border border-red-200'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpCircle className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                ) : (
                  <ArrowDownCircle className={`h-6 w-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-base font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                      {transaction.description}
                    </p>
                    <div className={`mt-1.5 flex items-center gap-2 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-medium ${
                        darkMode ? 'bg-slate-700/50 text-slate-300' : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {transaction.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(transaction.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'income' 
                        ? darkMode ? 'text-green-400' : 'text-green-600'
                        : darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    {userRole === 'admin' && (
                      <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <button 
                          onClick={() => setEditingTransaction(transaction)}
                          className={`rounded-md p-1.5 transition-all ${
                            darkMode 
                              ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                          }`}
                          aria-label="Edit transaction"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(transaction.id)}
                          className={`rounded-md p-1.5 transition-all ${
                            darkMode 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          }`}
                          aria-label="Delete transaction"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  )
}

export default TransactionsList

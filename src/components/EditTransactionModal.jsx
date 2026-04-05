import { useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/mockData'

const EditTransactionModal = ({ transaction, onClose }) => {
  const { updateTransaction, darkMode } = useApp()
  const [formData, setFormData] = useState({
    type: transaction.type,
    amount: Math.abs(transaction.amount).toString(),
    category: transaction.category,
    description: transaction.description
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const amount = formData.type === 'expense' 
      ? -Math.abs(parseFloat(formData.amount))
      : Math.abs(parseFloat(formData.amount))

    updateTransaction(transaction.id, {
      ...formData,
      amount
    })

    onClose()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md rounded-xl border shadow-2xl animate-slide-up ${
          darkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-300 bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between border-b p-6 ${
          darkMode ? 'border-slate-800' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
            Edit Transaction
          </h2>
          <button 
            onClick={onClose}
            className={`rounded-lg p-2 transition-colors ${
              darkMode 
                ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-6">
            <div>
              <label className={`mb-2 block text-sm font-medium ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  darkMode 
                    ? 'border-slate-700 bg-slate-800 text-slate-200' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className={`mb-2 block text-sm font-medium ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  darkMode 
                    ? 'border-slate-700 bg-slate-800 text-slate-200' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-medium ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  darkMode 
                    ? 'border-slate-700 bg-slate-800 text-slate-200' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`mb-2 block text-sm font-medium ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  darkMode 
                    ? 'border-slate-700 bg-slate-800 text-slate-200' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
                placeholder="Enter description..."
                rows="3"
                required
              />
            </div>
          </div>

          <div className={`flex gap-3 border-t p-6 ${
            darkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <button 
              type="button" 
              onClick={onClose}
              className={`flex-1 rounded-lg border px-4 py-2.5 font-medium transition-all ${
                darkMode 
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700' 
                  : 'border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 font-medium text-white transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransactionModal

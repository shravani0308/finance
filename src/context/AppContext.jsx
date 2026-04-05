import { createContext, useContext, useState, useEffect } from 'react'
import { mockTransactions } from '../data/mockData'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('viewer')
  const [darkMode, setDarkMode] = useState(true)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions)
      // If empty or invalid, use mock data
      if (parsed && parsed.length > 0) {
        setTransactions(parsed)
      } else {
        setTransactions(mockTransactions)
        localStorage.setItem('transactions', JSON.stringify(mockTransactions))
      }
    } else {
      setTransactions(mockTransactions)
      localStorage.setItem('transactions', JSON.stringify(mockTransactions))
    }

    const savedRole = localStorage.getItem('userRole')
    if (savedRole) setUserRole(savedRole)

    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode))
  }, [])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('userRole', userRole)
  }, [userRole])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.body.classList.remove('light-mode')
      document.documentElement.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
      document.documentElement.classList.add('light-mode')
    }
  }, [darkMode])

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    }
    setTransactions([newTransaction, ...transactions])
  }

  const updateTransaction = (id, updatedData) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, ...updatedData } : t
    ))
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const value = {
    userRole,
    setUserRole,
    darkMode,
    setDarkMode,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
